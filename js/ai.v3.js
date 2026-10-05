/**
 * FREESUME · AI 模块 v2.0
 * - 预置多家 AI 提供商（Groq/硅基流动/DeepSeek/Kimi/豆包/OpenRouter/阿里云百炼/OpenAI）
 * - 支持流式输出（打字机效果）
 * - 一键测试连接
 * - 智能 Mock 降级
 */

// ===== 预置提供商 =====
const AI_PROVIDERS = [
  {
    id: 'groq',
    name: 'Groq',
    logo: '🟢',
    url: 'https://console.groq.com',
    apiUrl: 'https://api.groq.com/openai/v1/chat/completions',
    defaultModel: 'llama-3.3-70b-versatile',
    models: ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile', 'meta-llama/llama-4-scout-17b-16e-instruct', 'deepseek-r1-distill-llama-70b', 'qwen/qwen3-32b'],
    note: '免费额度，速度极快（毫秒级响应）'
  },
  {
    id: 'siliconflow',
    name: '硅基流动',
    logo: '🟣',
    url: 'https://siliconflow.cn',
    apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
    defaultModel: 'Qwen/Qwen2.5-7B-Instruct',
    models: ['Qwen/Qwen2.5-7B-Instruct', 'deepseek-ai/DeepSeek-V3', 'Pro/moonshotai/Kimi-K2.5'],
    note: '国内访问快，价格便宜，中文效果好'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    logo: '🔵',
    url: 'https://platform.deepseek.com',
    apiUrl: 'https://api.deepseek.com/v1/chat/completions',
    defaultModel: 'deepseek-chat',
    models: ['deepseek-chat', 'deepseek-reasoner'],
    note: '国产模型顶尖，推理能力强'
  },
  {
    id: 'kimi',
    name: 'Kimi (月之暗面)',
    logo: '🌙',
    url: 'https://platform.moonshot.cn',
    apiUrl: 'https://api.moonshot.cn/v1/chat/completions',
    defaultModel: 'moonshot-v1-8k',
    models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'],
    note: '长上下文，支持 128K'
  },
  {
    id: 'doubao',
    name: '豆包 (字节跳动)',
    logo: '🟠',
    url: 'https://console.bce.baidu.com/qianfan',
    apiUrl: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
    defaultModel: 'doubao-pro-32k',
    models: ['doubao-pro-32k', 'doubao-pro-128k'],
    note: '国内大厂稳定'
  },
  {
    id: 'aliyun',
    name: '阿里云百炼',
    logo: '🔴',
    url: 'https://bailian.console.aliyun.com',
    apiUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
    defaultModel: 'qwen-plus',
    models: ['qwen-plus', 'qwen-max', 'qwen-turbo'],
    note: '通义万相，阿里云生态'
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    logo: '🌐',
    url: 'https://openrouter.ai',
    apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
    defaultModel: 'openai/gpt-4o-mini',
    models: ['openai/gpt-4o-mini', 'openai/gpt-4o', 'anthropic/claude-3.5-sonnet', 'google/gemini-pro-1.5'],
    note: '聚合全球多家模型，一个Key通吃'
  },
  {
    id: 'openai',
    name: 'OpenAI',
    logo: '⚪',
    url: 'https://platform.openai.com',
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    defaultModel: 'gpt-4o-mini',
    models: ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'],
    note: '原版 OpenAI'
  },
  {
    id: 'custom',
    name: '自定义',
    logo: '⚙️',
    url: '',
    apiUrl: '',
    defaultModel: '',
    models: [],
    note: '自建或其他兼容 OpenAI 格式的 API'
  }
];

// ===== AI 主对象 =====
const AI = {
  config: {
    provider: '',    // 选择的提供商ID
    apiKey: '',
    apiUrl: '',
    model: ''
  },

  // ====== 初始化配置 ======
  init: function() {
    const saved = Storage.get('ai_config');
    if (saved) {
      this.config = { ...this.config, ...saved };
      // 自动修复废弃模型
      const p = AI_PROVIDERS.find(x => x.id === this.config.provider);
      if (p && this.config.model && !p.models.includes(this.config.model)) {
        console.warn(`[FREESUME] 模型 ${this.config.model} 已废弃，自动切换为 ${p.defaultModel}`);
        this.config.model = p.defaultModel;
        Storage.set('ai_config', this.config);
      }
    }
  },

  saveConfig: function(cfg) {
    this.config = { ...this.config, ...cfg };
    Storage.set('ai_config', this.config);
  },

  hasRealAPI: function() {
    return !!(this.config.apiKey && this.config.apiUrl);
  },

  getProvider: function(id) {
    return AI_PROVIDERS.find(p => p.id === id);
  },

  // ===== 测试连接 =====
  testConnection: async function() {
    if (!this.hasRealAPI()) {
      return { ok: false, message: '请先配置 API Key 和 API URL' };
    }
    try {
      const res = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model || 'gpt-4o-mini',
          messages: [{ role: 'user', content: 'hi' }],
          max_tokens: 10
        })
      });
      if (res.ok) {
        const data = await res.json();
        return { ok: true, message: '✅ 连接成功！AI 在线' };
      } else {
        const err = await res.text();
        return { ok: false, message: `❌ API 错误 (${res.status})：${err.slice(0, 100)}` };
      }
    } catch (err) {
      return { ok: false, message: `❌ 网络错误：${err.message}` };
    }
  },

  // ===== 统一调用（非流式，兼容旧代码）======
  chat: async function(messages, systemPrompt) {
    if (!this.hasRealAPI()) return this.mockResponse(messages, systemPrompt);
    try {
      return await this.callRealAPI(messages, systemPrompt);
    } catch (err) {
      showToast('AI 调用失败，已切换为 Mock', 'error');
      return this.mockResponse(messages, systemPrompt);
    }
  },

  // ===== 流式调用 =====
  chatStream: async function(messages, systemPrompt, onChunk) {
    if (!this.hasRealAPI()) {
      // Mock 也做流式打字机效果
      const mock = this.mockResponse(messages, systemPrompt);
      for (const ch of mock) {
        onChunk(ch);
        await new Promise(r => setTimeout(r, 15));
      }
      return;
    }

    const fullMessages = systemPrompt
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : messages;

    const res = await fetch(this.config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model || 'gpt-4o-mini',
        messages: fullMessages,
        temperature: 0.7,
        stream: true
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`API ${res.status}: ${errText.slice(0, 100)}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const data = trimmed.slice(5).trim();
        if (data === '[DONE]') continue;

        try {
          const json = JSON.parse(data);
          const delta = json.choices?.[0]?.delta?.content || '';
          if (delta) onChunk(delta);
        } catch { /* 跳过无法解析的行 */ }
      }
    }
  },

  // ===== 非流式真实 API =====
  callRealAPI: async function(messages, systemPrompt) {
    const fullMessages = systemPrompt
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : messages;

    const res = await fetch(this.config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model || 'gpt-4o-mini',
        messages: fullMessages,
        temperature: 0.7
      })
    });

    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  },

  // ===== Mock（保留所有原有 Mock 逻辑）======
  mockResponse: function(messages, systemPrompt) {
    const userMessage = messages[messages.length - 1]?.content || '';
    if (systemPrompt?.includes('简历分析')) return this.mockResumeAnalysis(userMessage);
    if (systemPrompt?.includes('岗位匹配')) return this.mockJobMatching(userMessage);
    if (systemPrompt?.includes('复盘')) return this.mockReplayAnalysis(userMessage);
    if (systemPrompt?.includes('自我评价')) return this.mockSelfEval(userMessage);
    return this.mockGeneral(userMessage);
  },

  mockResumeAnalysis: function(text) {
    const kw = text.toLowerCase();
    let score = 75, sug = [];
    if (kw.includes('项目') || kw.includes('实习')) { sug.push('💡 项目经历建议增加量化数据（性能提升X%、支撑QPS X）'); score += 5; }
    if (kw.includes('java') || kw.includes('spring')) { sug.push('☕ Java 技术栈描述清晰，建议补充版本号和应用场景'); score += 3; }
    if (kw.includes('redis') || kw.includes('mysql')) { sug.push('🗄️ 数据库经验是加分项，建议补充优化案例'); score += 3; }
    if (kw.includes('分布式') || kw.includes('微服务')) { sug.push('🔗 分布式经验很亮眼！补充具体问题和解决方案'); score += 4; }
    if (kw.includes('不足') || kw.includes('问题')) {
      sug.push('📝 建议使用 STAR 法则描述：背景-任务-行动-结果');
      sug.push('🎯 可增加失败/踩坑经历，展示问题解决能力');
    }
    return `### 📊 简历分析报告\n\n**综合评分：${Math.min(score, 95)}/100**\n\n### ✅ 亮点\n- 项目经历有实操深度，技术栈覆盖主流生态\n- 具备系统性能优化意识\n\n### 🔧 改进建议\n${sug.join('\n') || '尝试增加更多量化数据和项目成果'}\n\n### 💬 下一步\n需要我帮你：改写项目描述？生成岗位匹配简历？模拟面试？`;
  },

  mockJobMatching: function(jdText) {
    const company = jdText.match(/字节|阿里|腾讯|美团|百度|小红书|小米|理想|华为/g)?.[0] || '目标公司';
    return `### 🎯 岗位匹配分析\n\n**目标：${company} 后端开发 · 匹配度 85%**\n\n### ✅ 匹配亮点\n1. Spring Boot + Redis + MySQL 与 JD 高度吻合\n2. 项目性能优化经历可重点突出\n3. 分布式经验是加分项\n\n### ⚠️ 差距\n| JD 要求 | 建议 |\n|---------|------|\n| 微服务治理 | 补充 Dubbo/Spring Cloud |\n| 消息队列 | 学习 RocketMQ/Kafka |\n| 容器化 | 补充 Docker/K8s |\n\n### 🔑 改写建议\n**原：** 负责后端架构优化，提升性能\n**改：** 主导架构优化，引入 Redis 多级缓存 + MySQL 读写分离，P99 从 800ms 降至 120ms，QPS 从 500 提升至 3000，性能提升 500%+。`;
  },

  mockReplayAnalysis: function() {
    return `### 📝 面试复盘分析\n\n### 🔴 需加强\n- **分布式事务** - Saga/TCC/2PC 适用场景对比\n- **JVM 调优** - G1 vs CMS、GC 日志分析实战\n\n### 🟢 表现良好\n- Redis 缓存穿透/击穿/雪崩回答结构清晰\n- 项目经验有数据支撑\n\n### 📚 推荐准备\n1. 《DDIA》重点章节\n2. 准备2-3个完整系统设计案例\n3. STAR 法则故事库\n\n### 🎯 下次行动\n- [ ] 整理分布式事务对比表\n- [ ] 写 JVM 调优博客\n- [ ] 模拟系统设计面试`;
  },

  mockSelfEval: function(ctx) {
    return `我是一名充满热情的后端开发工程师，具备扎实的 Java 技术栈和丰富的项目实践经验。

在技术深度上，我深入研究过 Spring Boot 源码、Redis 核心数据结构、MySQL 索引优化，并在实际项目中应用了分布式缓存、消息队列、读写分离等方案。我关注技术的落地效果，每一次优化都会通过数据验证。

在协作上，我善于从系统整体架构思考问题，注重代码质量与可维护性。在与产品、测试紧密配合的过程中，我学会了如何在需求变更时平衡技术债与交付速度。

我喜欢拆解复杂问题，把模糊的需求变成清晰的技术方案。持续学习是我的习惯，关注后端技术生态的新动态，也乐于分享所学。${ctx ? `\n\n针对「${ctx.slice(0, 20)}...」这类方向，我希望能进一步深入。` : ''}`;
  },

  mockGeneral: function(text) {
    return `收到："${text.slice(0, 100)}"\n\n当前使用内置 Mock AI。要接入真实 AI，点右上角 ⚙️ 设置按钮选一家提供商填 Key 就行。`;
  }
};

// ============================================
// 设置面板（升级版）
// ============================================
function openAISettings() {
  const modal = document.getElementById('aiSettingsModal');
  if (modal) { modal.remove(); }

  const current = AI.config;
  const providersHtml = AI_PROVIDERS.map(p => `
    <div class="provider-card ${current.provider === p.id ? 'selected' : ''}" data-id="${p.id}">
      <div class="provider-logo">${p.logo}</div>
      <div class="provider-info">
        <div class="provider-name">${p.name}</div>
        <div class="provider-note">${p.note}</div>
      </div>
      <div class="provider-check">${current.provider === p.id ? '✓' : ''}</div>
    </div>
  `).join('');

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'aiSettingsModal';
  overlay.innerHTML = `
    <div class="modal" style="max-width: 680px;">
      <div class="modal-header">
        <h3>⚙️ AI 设置</h3>
        <button class="modal-close" onclick="document.getElementById('aiSettingsModal').remove()">✕</button>
      </div>
      <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
        <p style="font-size:13px;color:var(--text-secondary);margin-bottom:16px;">
          选择一家 AI 提供商，填入 API Key 即可接入真实 AI。留空则使用内置 Mock 回复。
        </p>

        <div class="provider-grid">${providersHtml}</div>

        <div id="customConfig" style="display:none;margin-top:16px;">
          <div class="form-group">
            <label>API Endpoint URL</label>
            <input type="text" class="form-input" id="aiApiUrl" placeholder="https://api.xxx.com/v1/chat/completions" />
          </div>
          <div class="form-group">
            <label>API Key</label>
            <input type="password" class="form-input" id="aiApiKey" placeholder="sk-..." />
          </div>
          <div class="form-group">
            <label>模型名称</label>
            <input type="text" class="form-input" id="aiModel" placeholder="gpt-4o-mini" />
          </div>
        </div>

        <div class="form-group" style="margin-top:16px;">
          <label>API Key</label>
          <input type="password" class="form-input" id="aiApiKeyGlobal" placeholder="sk-..." value="${current.apiKey || ''}" />
        </div>

        <div id="testResult" style="margin-top:12px;"></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="testAIConnection()">🔌 测试连接</button>
        <button class="btn btn-outline" onclick="document.getElementById('aiSettingsModal').remove()">取消</button>
        <button class="btn btn-primary" onclick="saveAISettings()">保存设置</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.classList.add('show');

  // 绑定提供商选择
  document.querySelectorAll('.provider-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.provider-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const id = card.dataset.id;
      const p = AI.getProvider(id);
      document.getElementById('customConfig').style.display = id === 'custom' ? 'block' : 'none';
      // 预填 URL 和模型
      if (p && p.apiUrl) {
        document.getElementById('aiApiUrlGlobal') && (document.getElementById('aiApiUrlGlobal')._prefill = p.apiUrl);
      }
    });
  });
}

function testAIConnection() {
  document.getElementById('testResult').innerHTML = '<div style="color:#888;font-size:13px;">⏳ 测试中...</div>';
  const providerId = document.querySelector('.provider-card.selected')?.dataset.id;
  const key = document.getElementById('aiApiKeyGlobal')?.value.trim() || document.getElementById('aiApiKey')?.value.trim();
  const p = AI.getProvider(providerId) || {};
  const url = p.apiUrl || document.getElementById('aiApiUrl')?.value.trim();
  const model = p.defaultModel || document.getElementById('aiModel')?.value.trim();

  AI.config = { ...AI.config, apiKey: key, apiUrl: url, model: model, provider: providerId };

  AI.testConnection().then(res => {
    document.getElementById('testResult').innerHTML = `<div style="color:${res.ok ? '#00b894' : '#e17055'};font-size:13px;">${res.message}</div>`;
  });
}

function saveAISettings() {
  const providerId = document.querySelector('.provider-card.selected')?.dataset.id || AI.config.provider || 'custom';
  const p = AI.getProvider(providerId) || {};
  const apiKey = document.getElementById('aiApiKeyGlobal')?.value.trim() || document.getElementById('aiApiKey')?.value.trim();
  const apiUrl = p.apiUrl || document.getElementById('aiApiUrl')?.value.trim();
  const model = p.defaultModel || document.getElementById('aiModel')?.value.trim();

  AI.saveConfig({ provider: providerId, apiKey, apiUrl, model });
  document.getElementById('aiSettingsModal').remove();
  showToast(AI.hasRealAPI() ? '✅ AI 已启用真实 API' : 'AI 设置已保存（Mock 模式）', AI.hasRealAPI() ? 'success' : 'info');
  if (typeof updateAIStatus === 'function') updateAIStatus();
}

// 导出
window.FREESUME = window.FREESUME || {};
window.FREESUME.AI = AI;
window.FREESUME.AI_PROVIDERS = AI_PROVIDERS;
window.FREESUME.openAISettings = openAISettings;

console.log('🤖 FREESUME AI v2.0 已加载');
