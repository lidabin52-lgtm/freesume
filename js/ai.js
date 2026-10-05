/**
 * FREESUME · AI 模块
 * 支持真实API调用（OpenAI兼容格式）和本地智能Mock
 */

const AI = {
  // 配置
  config: {
    apiKey: '',      // 用户配置的API Key
    apiUrl: '',      // API endpoint，留空则用mock
    model: ''        // 模型名称
  },

  // ====== 初始化配置 ======
  init: function() {
    const saved = Storage.get('ai_config');
    if (saved) this.config = { ...this.config, ...saved };
  },

  saveConfig: function(apiKey, apiUrl, model) {
    this.config = { apiKey, apiUrl, model };
    Storage.set('ai_config', this.config);
  },

  hasRealAPI: function() {
    return !!(this.config.apiKey && this.config.apiUrl);
  },

  // ====== 统一调用入口 ======
  chat: async function(messages, systemPrompt) {
    if (this.hasRealAPI()) {
      return await this.callRealAPI(messages, systemPrompt);
    } else {
      return this.mockResponse(messages, systemPrompt);
    }
  },

  // ====== 真实API调用 ======
  callRealAPI: async function(messages, systemPrompt) {
    const fullMessages = systemPrompt
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : messages;

    try {
      const response = await fetch(this.config.apiUrl, {
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

      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'AI回复解析失败';
    } catch (err) {
      console.error('AI API Error:', err);
      showToast('AI调用失败，已切换为Mock回复', 'error');
      return this.mockResponse(messages, systemPrompt);
    }
  },

  // ====== 智能Mock回复 ======
  mockResponse: function(messages, systemPrompt) {
    const userMessage = messages[messages.length - 1]?.content || '';
    
    // 根据系统prompt判断场景
    if (systemPrompt?.includes('简历分析')) {
      return this.mockResumeAnalysis(userMessage);
    } else if (systemPrompt?.includes('岗位匹配')) {
      return this.mockJobMatching(userMessage);
    } else if (systemPrompt?.includes('复盘')) {
      return this.mockReplayAnalysis(userMessage);
    } else if (systemPrompt?.includes('自我评价')) {
      return this.mockSelfEval(userMessage);
    }
    
    // 默认通用回复
    return this.mockGeneral(userMessage);
  },

  // ====== 场景化Mock ======
  mockResumeAnalysis: function(text) {
    const keywords = text.toLowerCase();
    let score = 75;
    let suggestions = [];

    if (keywords.includes('项目') || keywords.includes('实习')) {
      suggestions.push('💡 你的项目经历是亮点，建议在描述中增加量化数据（如：性能提升X%、支撑QPS X）');
      score += 5;
    }
    if (keywords.includes('java') || keywords.includes('spring')) {
      suggestions.push('☕ Java技术栈描述清晰，建议补充熟悉的版本号和具体应用场景');
      score += 3;
    }
    if (keywords.includes('redis') || keywords.includes('mysql')) {
      suggestions.push('🗄️ 数据库经验是加分项，建议补充具体的优化案例（慢查询优化、索引设计等）');
      score += 3;
    }
    if (keywords.includes('分布式') || keywords.includes('微服务')) {
      suggestions.push('🔗 分布式经验很亮眼！建议补充具体遇到的问题和解决方案（如CAP权衡、服务治理）');
      score += 4;
    }
    if (keywords.includes('不足') || keywords.includes('问题') || keywords.includes('改进')) {
      suggestions.push('📝 项目描述建议使用 STAR 法则：Situation（背景）- Task（任务）- Action（行动）- Result（结果）');
      suggestions.push('🎯 可以增加一些失败/踩坑的经历，展示问题解决能力，这比纯粹写"做了什么"更有说服力');
    }

    return `### 📊 简历分析报告（Mock）

**综合评分：${Math.min(score, 95)}/100**

---

### ✅ 亮点
- 项目经历有实操深度，技术栈覆盖主流后端生态
- 具备系统性能优化意识

### 🔧 改进建议（${suggestions.length > 0 ? suggestions.length : 3}条）
${suggestions.length > 0 ? suggestions.join('\n') : '尝试在简历中增加更多量化数据和项目成果'}

---

### 💬 快速下一步
需要我帮你：
1. 改写某段项目描述？
2. 生成针对特定岗位的匹配简历？
3. 模拟面试问答？`;
  },

  mockJobMatching: function(jdText) {
    const company = jdText.match(/字节|阿里|腾讯|美团|百度|小红书|小米|理想|华为/g)?.[0] || '目标公司';
    
    return `### 🎯 岗位匹配分析（Mock）

**目标岗位：${company} 后端开发**
**匹配度：85%**

---

### ✅ 匹配亮点
1. **技术栈契合度高** - 你的 Spring Boot + Redis + MySQL 经验与JD要求高度吻合
2. **高并发经验** - 项目中的性能优化经历可以重点突出
3. **系统设计能力** - 分布式相关经验是加分项

### ⚠️ 差距分析
| JD要求 | 你的现状 | 建议 |
|--------|---------|------|
| 微服务治理 | 项目未明确提及 | 可补充 Dubbo/Spring Cloud 相关经验 |
| 消息队列 | 简历中未体现 | 建议学习并在项目中引入 RocketMQ/Kafka |
| 容器化部署 | 暂未提及 | 补充 Docker/K8s 相关经验 |

### 🔑 简历改写建议

**原描述：**
> 负责后端架构优化，通过 Redis 缓存策略提升性能

**建议改写：**
> 主导后端系统架构优化，引入 **Redis 多级缓存策略**（本地缓存 + 分布式缓存 + DB），配合 **MySQL 读写分离** 和 **分库分表** 方案，将核心查询接口 P99 延迟从 **800ms 降至 120ms**，QPS 支撑能力从 **500 提升至 3000**，整体性能提升 **500%+**。

---

需要我帮你直接在简历中应用这些改写吗？`;
  },

  mockReplayAnalysis: function(content) {
    return `### 📝 复盘分析（Mock）

基于你记录的面试内容，我整理了以下要点：

---

### 🔴 需要加强的问题点
- **分布式事务** - Saga/TCC/2PC 的适用场景对比需要更清晰
- **JVM调优** - 实际调优案例（G1 vs CMS、GC日志分析）需要准备

### 🟢 表现良好的部分
- Redis 缓存穿透/击穿/雪崩的回答结构清晰
- 项目经验描述有数据支撑

### 📚 推荐准备方向
1. **分布式系统** - 《Designing Data-Intensive Applications》重点章节
2. **系统设计** - 准备2-3个完整案例（设计一个短链服务、设计一个秒杀系统）
3. **行为面试** - 准备 STAR 法则的故事库

### 🎯 下次面试行动计划
- [ ] 整理分布式事务对比表格
- [ ] 写一篇博客总结 JVM 调优实战
- [ ] 模拟一次完整的系统设计面试

---

💡 AI 提示：在下次面试前，可以把复盘要点粘贴给我，我帮你模拟问答！`;
  },

  mockSelfEval: function(context) {
    return `我是一名充满热情的后端开发工程师，具备扎实的Java技术栈和丰富的项目实践经验。

在技术深度上，我深入研究过 Spring Boot 源码、Redis 核心数据结构、MySQL 索引优化，并在实际项目中应用了分布式缓存、消息队列、读写分离等方案。我关注技术的落地效果，每一次优化都会通过数据验证。

在协作上，我善于从系统整体架构思考问题，注重代码质量与可维护性。在与产品、测试紧密配合的过程中，我学会了如何在需求变更时平衡技术债与交付速度。

我喜欢拆解复杂问题，把模糊的需求变成清晰的技术方案。持续学习是我的习惯，关注后端技术生态的新动态，也乐于分享所学。

${context ? `针对「${context.slice(0, 20)}...」这类方向，我希望能进一步深入。` : ''}`;
  },

  mockGeneral: function(text) {
    return `我收到了你的消息："${text.slice(0, 100)}"

目前 FREESUME 使用的是内置 Mock AI 回复。要接入真实 AI：

1. 点击右上角用户头像 → 设置
2. 填入 API Key 和 API URL（支持 OpenAI 兼容格式）
3. 保存后即可使用真实 AI

推荐的免费/低价 AI API：
- 🟢 **Groq** (console.groq.com) - 免费额度，速度快
- 🔵 **OpenRouter** (openrouter.ai) - 聚合多家模型
- 🟣 **硅基流动** (siliconflow.cn) - 国内访问快，便宜

有什么简历相关的问题想聊？`;
  }
};

// ============================================
// 设置面板相关
// ============================================
function openAISettings() {
  const modal = document.getElementById('aiSettingsModal');
  if (!modal) {
    // 动态创建设置弹窗
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'aiSettingsModal';
    overlay.innerHTML = `
      <div class="modal" style="max-width: 520px;">
        <div class="modal-header">
          <h3>⚙️ AI 设置</h3>
          <button class="modal-close" onclick="document.getElementById('aiSettingsModal').remove()">✕</button>
        </div>
        <div class="modal-body">
          <p style="font-size:13px;color:var(--text-secondary);margin-bottom:16px;">
            FREESUME 支持接入真实 AI API。留空则使用内置 Mock 回复。
          </p>
          <div class="form-group">
            <label>API Endpoint</label>
            <input type="text" class="form-input" id="aiApiUrl" placeholder="https://api.groq.com/openai/v1/chat/completions" />
          </div>
          <div class="form-group">
            <label>API Key</label>
            <input type="password" class="form-input" id="aiApiKey" placeholder="sk-..." />
          </div>
          <div class="form-group">
            <label>模型名称</label>
            <input type="text" class="form-input" id="aiModel" placeholder="gpt-4o-mini / llama3-8b-8192" />
          </div>
          <div style="margin-top:16px;padding:12px;background:var(--bg-secondary);border-radius:8px;font-size:12px;color:var(--text-secondary);">
            <strong>💡 推荐方案：</strong><br>
            • Groq (免费): console.groq.com → llama3-8b-8192<br>
            • 硅基流动: siliconflow.cn → Qwen2.5-7B<br>
            • OpenRouter: openrouter.ai → 多种模型
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="document.getElementById('aiSettingsModal').remove()">取消</button>
          <button class="btn btn-primary" onclick="saveAISettings()">保存设置</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }
  
  // 填入已有配置
  setTimeout(() => {
    document.getElementById('aiApiUrl').value = AI.config.apiUrl || '';
    document.getElementById('aiApiKey').value = AI.config.apiKey || '';
    document.getElementById('aiModel').value = AI.config.model || '';
    document.getElementById('aiSettingsModal').classList.add('show');
  }, 50);
}

function saveAISettings() {
  const apiKey = document.getElementById('aiApiKey').value.trim();
  const apiUrl = document.getElementById('aiApiUrl').value.trim();
  const model = document.getElementById('aiModel').value.trim();
  
  AI.saveConfig(apiKey, apiUrl, model);
  document.getElementById('aiSettingsModal').remove();
  
  if (AI.hasRealAPI()) {
    showToast('✅ AI 设置已保存，已启用真实 API', 'success');
  } else {
    showToast('AI 设置已保存，当前使用 Mock 模式', 'info');
  }
}

// 导出
window.FREESUME = window.FREESUME || {};
window.FREESUME.AI = AI;
window.FREESUME.openAISettings = openAISettings;

console.log('🤖 FREESUME AI 模块已加载');
