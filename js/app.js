/**
 * FREESUME · 简历工作台
 * 主应用逻辑
 */

// ============================================
// 视图切换
// ============================================
function showView(viewName) {
  // 隐藏所有视图
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  // 显示目标视图
  const targetView = document.getElementById('view-' + viewName);
  if (targetView) {
    targetView.classList.add('active');
  }
  
  // 更新导航链接状态
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.view === viewName);
  });
  
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // 更新URL hash
  history.replaceState(null, '', '#' + viewName);
}

// 绑定导航点击事件
document.addEventListener('DOMContentLoaded', () => {
  // 导航链接
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const viewName = link.dataset.view;
      if (viewName) {
        showView(viewName);
      }
    });
  });
  
  // 区域列表点击
  document.querySelectorAll('.region-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.region-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      showToast('已切换到 ' + item.querySelector('.region-name').textContent + ' 分析', 'info');
    });
  });
  
  // 匹配历史点击
  document.querySelectorAll('.match-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.match-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      // 模拟加载进度
      simulateGeneration();
    });
  });
  
  // 过滤器点击
  document.querySelectorAll('.filter-chips .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chips .chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });
  
  // 快速操作按钮
  document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('已复制建议到剪贴板', 'success');
    });
  });
  
  // AI生成按钮
  document.querySelectorAll('.btn-ai-generate').forEach(btn => {
    btn.addEventListener('click', () => {
      const textarea = btn.closest('.form-group')?.querySelector('.form-textarea');
      if (textarea) {
        textarea.value = 'AI生成的自我评价内容会在这里显示...\n\n我是一名充满热情的后端开发工程师，具备扎实的Java技术栈和丰富的项目实践经验。善于从系统整体架构思考问题，注重代码质量与可维护性。具备良好的团队协作能力和沟通能力，能够快速学习新技术并应用于实际项目。';
        showToast('AI已为您生成内容', 'success');
      }
    });
  });
  
  // 初始化：从URL hash加载视图
  const hash = window.location.hash.substring(1);
  if (hash && document.getElementById('view-' + hash)) {
    showView(hash);
  }
});

// ============================================
// 模态框
// ============================================
function openReplayModal() {
  const modal = document.getElementById('replayModal');
  if (modal) {
    modal.classList.add('show');
  }
}

function closeReplayModal() {
  const modal = document.getElementById('replayModal');
  if (modal) {
    modal.classList.remove('show');
  }
}

// 点击模态框外部关闭
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('show');
  }
});

// ESC键关闭模态框
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.show').forEach(m => m.classList.remove('show'));
  }
});

// ============================================
// Toast 通知
// ============================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = 'toast ' + type;
  
  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  };
  
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);
  
  // 3秒后自动移除
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============================================
// 模拟AI生成进度
// ============================================
function simulateGeneration() {
  const progressFill = document.querySelector('.progress-fill');
  if (!progressFill) return;
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      showToast('简历生成完成！', 'success');
    }
    progressFill.style.width = progress + '%';
  }, 300);
}

// ============================================
// 步骤指示器更新
// ============================================
function updateSteps(step) {
  const steps = document.querySelectorAll('.steps-indicator .step');
  const lines = document.querySelectorAll('.steps-indicator .step-line');
  
  steps.forEach((s, i) => {
    if (i < step) {
      s.classList.add('active');
    } else {
      s.classList.remove('active');
    }
  });
  
  lines.forEach((l, i) => {
    if (i < step - 1) {
      l.classList.add('active');
    } else {
      l.classList.remove('active');
    }
  });
}

// ============================================
// 表单交互
// ============================================
function initFormInteractions() {
  // 标签输入
  const tagInputs = document.querySelectorAll('.tag-input-inner');
  tagInputs.forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const value = input.value.trim();
        if (value) {
          const tag = document.createElement('span');
          tag.className = 'tag';
          tag.textContent = value;
          input.parentElement.insertBefore(tag, input);
          input.value = '';
        }
      }
    });
  });
  
  // 自动高度的textarea
  const textareas = document.querySelectorAll('.chat-input, .form-textarea');
  textareas.forEach(textarea => {
    textarea.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 200) + 'px';
    });
  });
}

// ============================================
// 数据持久化（localStorage）
// ============================================
const Storage = {
  get: (key) => {
    try {
      return JSON.parse(localStorage.getItem('freesume_' + key));
    } catch {
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem('freesume_' + key, JSON.stringify(value));
    } catch {
      console.warn('Storage full or unavailable');
    }
  },
  remove: (key) => {
    localStorage.removeItem('freesume_' + key);
  }
};

// ============================================
// 公司Logo映射
// ============================================
const COMPANY_LOGOS = {
  '字节': '🎵', '跳动': '🎵',
  '阿里': '🌙', '巴巴': '🌙',
  '腾讯': '🐧',
  '美团': '🥣',
  '百度': '🔍',
  '网易': '🎬',
  '京东': '📦',
  '滴滴': '🚗',
  '小米': '📱',
  '快手': '🎬',
  '拼多多': '🛒',
  '小红书': '📕',
  'B站': '🎮', 'bilibili': '🎮',
  '知乎': '❓',
  '华为': '🔧',
  '招商': '🏦',
  '比亚迪': '🚗',
  '理想': '🤖',
  '小鹏': '🚙',
  '蔚来': '⚡'
};

function getCompanyLogo(companyName) {
  for (const [key, logo] of Object.entries(COMPANY_LOGOS)) {
    if (companyName.includes(key)) return logo;
  }
  return companyName.charAt(0); // 取首字作Logo
}

// ============================================
// 状态样式映射
// ============================================
const STATUS_MAP = {
  '意向':    { cls: 'status-interest',  icon: '💡' },
  '已投递':  { cls: 'status-applied',   icon: '📤' },
  '笔试中':  { cls: 'status-written',   icon: '📝' },
  '面试中':  { cls: 'status-interview', icon: '🎤' },
  '已通过':  { cls: 'status-passed',    icon: '✅' },
  '已淘汰':  { cls: 'status-rejected',  icon: '❌' }
};

// ============================================
// 投递记录管理（完整版）
// ============================================
const Tracking = {
  // 当前筛选状态
  currentFilter: '全部',
  // 当前操作的记录ID（用于状态切换、复盘、详情）
  currentRecordId: null,

  // ====== 读取 ======
  getAll: () => Storage.get('tracking_records') || [],
  
  getById: (id) => {
    const records = Storage.get('tracking_records') || [];
    return records.find(r => r.id === Number(id));
  },

  // ====== 渲染 ======
  renderTable: function() {
    const records = this.getAll();
    const tbody = document.getElementById('trackingTableBody');
    if (!tbody) return;

    // 筛选
    let filtered = records;
    if (this.currentFilter !== '全部') {
      filtered = records.filter(r => r.status === this.currentFilter);
    }

    // 渲染空状态
    if (filtered.length === 0) {
      tbody.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📭</div>
          <p>暂无投递记录</p>
          <p style="margin-top:8px;">点击右上角 <b>+ 新建记录</b> 添加第一条吧！</p>
        </div>`;
      this.updateStats();
      return;
    }

    // 渲染表格行
    tbody.innerHTML = filtered.map(r => {
      const logo = getCompanyLogo(r.company);
      const statusInfo = STATUS_MAP[r.status] || { cls: '', icon: '📌' };
      const displayDate = r.date || '--';
      return `
        <div class="table-row" data-id="${r.id}">
          <div class="col col-company">
            <div class="row-logo">${logo}</div>
            <span>${r.company}</span>
          </div>
          <div class="col col-position">${r.position}</div>
          <div class="col col-status">
            <span class="status-badge ${statusInfo.cls}" onclick="Tracking.openStatusModal(${r.id})" style="cursor:pointer;">
              ${statusInfo.icon} ${r.status}
            </span>
          </div>
          <div class="col col-date">${displayDate}</div>
          <div class="col col-action">
            <button class="action-btn" onclick="Tracking.openDetailModal(${r.id})">📋</button>
            <button class="action-btn" onclick="Tracking.openReplayForRecord(${r.id})">📝</button>
            <button class="action-btn" onclick="Tracking.confirmDelete(${r.id})">🗑️</button>
          </div>
        </div>`;
    }).join('');

    this.updateStats();
  },

  updateStats: function() {
    const records = this.getAll();
    const counts = {
      '全部': records.length,
      '意向': 0, '已投递': 0, '笔试中': 0,
      '面试中': 0, '已通过': 0, '已淘汰': 0
    };
    records.forEach(r => { counts[r.status] = (counts[r.status] || 0) + 1; });

    // 更新Tab计数
    const mapping = {
      'countAll': '全部', 'countIntent': '意向', 'countApplied': '已投递',
      'countWritten': '笔试中', 'countInterview': '面试中',
      'countPassed': '已通过', 'countRejected': '已淘汰'
    };
    for (const [elId, key] of Object.entries(mapping)) {
      const el = document.getElementById(elId);
      if (el) el.textContent = counts[key] || 0;
    }

    // 更新统计条
    const statsEl = document.getElementById('trackingStats');
    if (statsEl) {
      const statItems = Object.entries(counts).filter(([k]) => k !== '全部');
      statsEl.innerHTML = statItems.map(([key, val]) =>
        `<div class="stat-pill"><span>${key}</span> ${val}</div>`
      ).join('');
    }
  },

  // ====== 筛选 ======
  setFilter: function(status) {
    this.currentFilter = status;
    document.querySelectorAll('#trackingTabs .tracking-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.status === status);
    });
    this.renderTable();
  },

  // ====== 新建/编辑 ======
  openEditModal: function(recordId) {
    const modal = document.getElementById('editRecordModal');
    const title = document.getElementById('editRecordTitle');
    const idInput = document.getElementById('editRecordId');
    const companyInput = document.getElementById('editCompany');
    const positionInput = document.getElementById('editPosition');
    const statusSelect = document.getElementById('editStatus');
    const dateInput = document.getElementById('editDate');
    const noteInput = document.getElementById('editNote');

    if (recordId) {
      // 编辑模式
      const record = this.getById(recordId);
      if (!record) return;
      title.textContent = '✏️ 编辑投递记录';
      idInput.value = record.id;
      companyInput.value = record.company || '';
      positionInput.value = record.position || '';
      statusSelect.value = record.status || '意向';
      dateInput.value = record.date ? record.date.replace(/\//g, '-') : '';
      noteInput.value = record.note || '';
    } else {
      // 新建模式
      title.textContent = '➕ 新建投递记录';
      idInput.value = '';
      companyInput.value = '';
      positionInput.value = '';
      statusSelect.value = '意向';
      dateInput.value = new Date().toISOString().split('T')[0];
      noteInput.value = '';
    }
    modal.classList.add('show');
  },

  closeEditModal: function() {
    document.getElementById('editRecordModal').classList.remove('show');
  },

  saveRecord: function() {
    const id = document.getElementById('editRecordId').value;
    const company = document.getElementById('editCompany').value.trim();
    const position = document.getElementById('editPosition').value.trim();
    const status = document.getElementById('editStatus').value;
    const dateRaw = document.getElementById('editDate').value;
    const note = document.getElementById('editNote').value.trim();

    if (!company || !position) {
      showToast('请填写公司名称和岗位名称', 'error');
      return;
    }

    const date = dateRaw ? dateRaw.replace(/-/g, '/') : '';
    const records = this.getAll();

    if (id) {
      // 更新
      const idx = records.findIndex(r => r.id === Number(id));
      if (idx >= 0) {
        records[idx] = {
          ...records[idx],
          company, position, status, date, note,
          updatedAt: new Date().toISOString()
        };
        showToast('记录已更新', 'success');
      }
    } else {
      // 新建
      records.unshift({
        id: Date.now(),
        company, position, status, date, note,
        createdAt: new Date().toISOString(),
        replays: []
      });
      showToast('记录已添加', 'success');
    }

    Storage.set('tracking_records', records);
    this.closeEditModal();
    this.renderTable();
  },

  // ====== 删除 ======
  confirmDelete: function(id) {
    const record = this.getById(id);
    if (!record) return;
    
    if (confirm(`确定要删除「${record.company} - ${record.position}」的投递记录吗？此操作不可恢复。`)) {
      const records = this.getAll().filter(r => r.id !== id);
      Storage.set('tracking_records', records);
      showToast('记录已删除', 'success');
      this.renderTable();
    }
  },

  // ====== 状态切换 ======
  openStatusModal: function(id) {
    this.currentRecordId = id;
    document.getElementById('statusModal').classList.add('show');
  },

  closeStatusModal: function() {
    document.getElementById('statusModal').classList.remove('show');
    this.currentRecordId = null;
  },

  setStatus: function(status) {
    if (!this.currentRecordId) return;
    const records = this.getAll();
    const record = records.find(r => r.id === this.currentRecordId);
    if (record) {
      record.status = status;
      Storage.set('tracking_records', records);
      showToast(`状态已更新为：${status}`, 'success');
    }
    this.closeStatusModal();
    this.renderTable();
  },

  // ====== 详情查看 ======
  openDetailModal: function(id) {
    const record = this.getById(id);
    if (!record) return;
    this.currentRecordId = id;

    const title = document.getElementById('detailTitle');
    const body = document.getElementById('detailBody');
    title.textContent = `${record.company} · ${record.position}`;

    const logo = getCompanyLogo(record.company);
    const statusInfo = STATUS_MAP[record.status] || { cls: '', icon: '📌' };
    const displayDate = record.date || '--';

    // 复盘列表
    const replays = record.replays || [];
    const replaysHtml = replays.length > 0 ? replays.map(r => `
      <div style="padding:12px;background:var(--bg-secondary);border-radius:8px;margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted);margin-bottom:6px;">
          <span>${r.title || '复盘笔记'}</span>
          <span>${r.createdAt ? new Date(r.createdAt).toLocaleDateString('zh-CN') : ''}</span>
        </div>
        <div style="font-size:13px;color:var(--text-secondary);line-height:1.6;">${(r.content || '').replace(/\n/g, '<br>')}</div>
      </div>
    `).join('') : '<p style="color:var(--text-muted);font-size:13px;">暂无复盘记录</p>';

    body.innerHTML = `
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;">
        <div style="width:56px;height:56px;border-radius:12px;background:var(--bg-secondary);display:flex;align-items:center;justify-content:center;font-size:28px;">${logo}</div>
        <div>
          <h4 style="font-size:18px;font-weight:600;color:var(--text-primary);">${record.company}</h4>
          <p style="font-size:14px;color:var(--text-secondary);margin-top:2px;">${record.position}</p>
        </div>
        <span class="status-badge ${statusInfo.cls}" style="margin-left:auto;">${statusInfo.icon} ${record.status}</span>
      </div>

      <div class="detail-info"><span>投递日期</span><span>${displayDate}</span></div>
      <div class="detail-info"><span>添加时间</span><span>${record.createdAt ? new Date(record.createdAt).toLocaleString('zh-CN') : '--'}</span></div>
      ${record.updatedAt ? `<div class="detail-info"><span>更新时间</span><span>${new Date(record.updatedAt).toLocaleString('zh-CN')}</span></div>` : ''}
      ${record.note ? `<div class="detail-info"><span>备注</span><span>${record.note}</span></div>` : ''}

      <h4 class="detail-section-title">📝 复盘笔记 (${replays.length})</h4>
      ${replaysHtml}
    `;

    document.getElementById('detailModal').classList.add('show');
  },

  closeDetailModal: function() {
    document.getElementById('detailModal').classList.remove('show');
  },

  openEditFromDetail: function() {
    if (this.currentRecordId) {
      this.closeDetailModal();
      this.openEditModal(this.currentRecordId);
    }
  },

  // ====== 复盘 ======
  openReplayForRecord: function(id) {
    this.currentRecordId = id;
    document.getElementById('replayModal').classList.add('show');
  },

  saveReplay: function() {
    if (!this.currentRecordId) { closeReplayModal(); return; }

    const type = document.querySelector('#replayModal .form-select').value;
    const title = document.querySelector('#replayModal .form-input[placeholder*="字节"]')?.value || '复盘笔记';
    const questions = document.querySelectorAll('#replayModal .form-textarea')[0].value;
    const content = document.querySelectorAll('#replayModal .form-textarea')[1].value;

    const records = this.getAll();
    const record = records.find(r => r.id === this.currentRecordId);
    if (record) {
      record.replays = record.replays || [];
      record.replays.unshift({
        id: Date.now(),
        type, title, questions, content,
        createdAt: new Date().toISOString()
      });
      Storage.set('tracking_records', records);
      showToast('复盘笔记已保存', 'success');
    }
    closeReplayModal();
    this.currentRecordId = null;
    this.renderTable();
  },

  // ====== 数据导出 ======
  exportData: function() {
    const records = this.getAll();
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `freesume_tracking_${formatDate(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`已导出 ${records.length} 条记录`, 'success');
  }
};

// ============================================
// 初始化
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initFormInteractions();

  // ====== 投递记录：绑定Tab筛选 ======
  document.querySelectorAll('#trackingTabs .tracking-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const status = tab.dataset.status;
      if (status) Tracking.setFilter(status);
    });
  });

  // ====== 投递记录：初始渲染 ======
  Tracking.renderTable();
  
  // 默认启动模拟进度（延迟一下让页面加载完成）
  setTimeout(() => {
    if (document.getElementById('view-matching')?.classList.contains('active')) {
      simulateGeneration();
    }
  }, 1000);

  // 添加一些演示用的投递记录（仅首次）
  if (!Storage.get('demo_loaded')) {
    Storage.set('demo_loaded', true);
    Storage.set('tracking_records', [
      { id: 1, company: '字节跳动', position: 'Java后端开发（实习）', status: '面试中', date: '2026/1/12', note: '内推，JD偏高并发场景', createdAt: '2026-01-10T00:00:00.000Z', replays: [
        { id: 101, title: '字节二面复盘', content: '面试整体感觉不错，分布式事务部分回答不够深入。下次重点准备 Saga 和 TCC。', type: '面试复盘', questions: 'Redis缓存穿透、击穿、雪崩的区别和解决方案？Spring事务传播机制有哪些？', createdAt: '2026-01-13T22:15:00.000Z' }
      ]},
      { id: 2, company: '阿里巴巴', position: '后端开发工程师', status: '已通过', date: '2026/1/10', note: '有笔试', createdAt: '2026-01-08T00:00:00.000Z', replays: [] },
      { id: 3, company: '美团', position: '后端开发', status: '已投递', date: '2026/1/8', note: '', createdAt: '2026-01-07T00:00:00.000Z', replays: [] },
      { id: 4, company: '小红书', position: '测试开发（实习）', status: '笔试中', date: '2026/1/6', note: '需要线上编程', createdAt: '2026-01-05T00:00:00.000Z', replays: [] },
      { id: 5, company: '小米集团', position: '前端开发（实习）', status: '意向', date: '', note: '先看看JD', createdAt: '2026-01-04T00:00:00.000Z', replays: [] },
      { id: 6, company: '理想汽车', position: 'AI应用开发', status: '已淘汰', date: '2026/1/3', note: '方向不太匹配', createdAt: '2026-01-02T00:00:00.000Z', replays: [
        { id: 102, title: '理想一面复盘', content: 'AI方向问得很深，需要补机器学习基础。', type: '面试复盘', questions: '了解哪些AI框架？PyTorch vs TensorFlow？', createdAt: '2026-01-04T10:00:00.000Z' }
      ]}
    ]);
  }

  // 如果用户之前已有数据，也重新渲染
  Tracking.renderTable();
});

// ============================================
// 工具函数
// ============================================
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('已复制到剪贴板', 'success');
    }).catch(() => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showToast('已复制到剪贴板', 'success');
  } catch {
    showToast('复制失败', 'error');
  }
  document.body.removeChild(textarea);
}

// 全局错误处理
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
});

// 导出到window（方便调试）
window.FREESUME = {
  showView,
  openReplayModal,
  closeReplayModal,
  showToast,
  simulateGeneration,
  Storage,
  Tracking
};

console.log('🚀 FREESUME · 简历工作台 已启动');
console.log('💡 调试提示：window.FREESUME 可访问所有方法');
