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

/* =====================================================
   🎨 模板库 & 📤 简历导入（v2.0 新增）
   ===================================================== */

// ====== 8 套简历模板数据 ======
const RESUME_TEMPLATES = [
  {
    id: 'tech-modern',
    name: '科技蓝现代风',
    category: 'it',
    categoryLabel: 'IT/技术',
    badge: '热门',
    accent: '#2563eb',
    render: (d) => `
      <div class="tpl-preview" style="border-top:3px solid ${d.accent};">
        <div style="font-size:16px;font-weight:700;color:${d.accent};margin-bottom:2px;">李大斌</div>
        <div style="font-size:9px;color:#888;margin-bottom:10px;">求职意向：Java软件开发 · 江西 · 19068051907</div>
        <div class="tpl-section-title" style="color:${d.accent};border-bottom:1px solid #ddd;padding-bottom:2px;">教育背景</div>
        <div class="tpl-item"><div style="font-weight:600;">厦门华厦学院</div><div style="font-size:9px;">通信工程 · 本科 · 2022-2028</div></div>
        <div class="tpl-section-title" style="color:${d.accent};border-bottom:1px solid #ddd;padding-bottom:2px;margin-top:8px;">项目/工作经历</div>
        <div class="tpl-item"><div style="font-weight:600;">校林广记网络科技</div><div style="font-size:9px;color:#666;">服务商 · 2024.03-2024.08</div><div class="tpl-text">促成超100例合作关系</div></div>
        <div class="tpl-item"><div style="font-weight:600;">越境云服供应链</div><div style="font-size:9px;color:#666;">电商运营 · 2025.11-2026.03</div><div class="tpl-text">商品上架 & Listing优化</div></div>
        <div class="tpl-section-title" style="color:${d.accent};border-bottom:1px solid #ddd;padding-bottom:2px;margin-top:8px;">技能栈</div>
        <div class="tpl-text">Java · Python · JavaScript · C++ · MySQL · HTML</div>
      </div>`
  },
  {
    id: 'minimal-paper',
    name: '极简白纸风',
    category: 'minimal',
    categoryLabel: '简洁/学术',
    accent: '#333333',
    badge: '经典',
    render: (d) => `
      <div class="tpl-preview">
        <div style="font-size:18px;font-weight:300;letter-spacing:3px;text-align:center;margin-bottom:4px;">李大斌</div>
        <div style="font-size:9px;color:#999;text-align:center;margin-bottom:14px;">Java软件开发 · ldb_888@qq.com</div>
        <div style="border-top:1px solid #ccc;border-bottom:1px solid #ccc;padding:4px 0;margin-bottom:10px;font-size:9px;color:#666;text-align:center;">
          厦门华厦学院 · 通信工程 · 2022-2028
        </div>
        <div class="tpl-text" style="margin-bottom:6px;"><strong>EXPERIENCE</strong><div style="border-top:1px dashed #ddd;margin-top:2px;"></div></div>
        <div class="tpl-item"><div class="tpl-text">校林广记网络科技 · 服务商<br/>促成超100例合作</div></div>
        <div class="tpl-item"><div class="tpl-text">越境云服供应链 · 电商运营<br/>商品上架、Listing优化</div></div>
        <div class="tpl-text" style="margin-top:6px;margin-bottom:2px;"><strong>SKILLS</strong><div style="border-top:1px dashed #ddd;margin-top:2px;"></div></div>
        <div class="tpl-text">Java · Python · JavaScript · C++</div>
      </div>`
  },
  {
    id: 'design-creative',
    name: '设计创意风',
    category: 'design',
    categoryLabel: '设计/创意',
    accent: '#ec4899',
    badge: '个性',
    render: (d) => `
      <div class="tpl-preview" style="background:linear-gradient(135deg,#fdf2f8,#faf5ff);padding:10px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <div style="width:28px;height:28px;border-radius:50%;background:${d.accent};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;">李</div>
          <div><div style="font-size:14px;font-weight:700;color:#333;">李大斌</div><div style="font-size:8px;color:#888;">Java Developer</div></div>
        </div>
        <div style="border-left:2px solid ${d.accent};padding-left:6px;margin-bottom:6px;">
          <div style="font-size:9px;font-weight:600;color:${d.accent};">🎨 关于我</div>
          <div class="tpl-text">5年Java开发经验，熟悉JVM原理</div>
        </div>
        <div style="border-left:2px solid ${d.accent};padding-left:6px;margin-bottom:6px;">
          <div style="font-size:9px;font-weight:600;color:${d.accent};">💼 经历</div>
          <div class="tpl-text">校林广记 · 服务商 · 2024<br/>越境云服 · 电商运营 · 2025</div>
        </div>
        <div style="border-left:2px solid ${d.accent};padding-left:6px;">
          <div style="font-size:9px;font-weight:600;color:${d.accent};">⚡ 技能</div>
          <div class="tpl-text">Java · Python · JS · C++</div>
        </div>
      </div>`
  },
  {
    id: 'business-dark',
    name: '商务深蓝风',
    category: 'business',
    categoryLabel: '产品/运营',
    accent: '#1e3a5f',
    badge: '高端',
    render: (d) => `
      <div class="tpl-preview">
        <div style="background:${d.accent};color:#fff;padding:10px;margin:-18px -18px 10px -18px;">
          <div style="font-size:16px;font-weight:700;">李大斌</div>
          <div style="font-size:8px;opacity:.8;">Java DEVELOPER · 19068051907 · ldb_888@qq.com</div>
        </div>
        <div style="display:flex;gap:10px;">
          <div style="width:35%;">
            <div class="tpl-section-title" style="color:${d.accent};">教育</div>
            <div class="tpl-text">厦门华厦学院<br/>通信工程本科<br/>2022-2028</div>
            <div class="tpl-section-title" style="color:${d.accent};margin-top:8px;">技能</div>
            <div class="tpl-text">Java / Python<br/>JavaScript / C++<br/>MySQL / HTML</div>
            <div class="tpl-section-title" style="color:${d.accent};margin-top:8px;">证书</div>
            <div class="tpl-text">日语N3<br/>WPS Office<br/>驾驶证</div>
          </div>
          <div style="width:65%;">
            <div class="tpl-section-title" style="color:${d.accent};">工作经历</div>
            <div class="tpl-item"><div style="font-weight:600;">校林广记网络科技</div><div class="tpl-text">服务商 · 2024.03-08<br/>促成超100例合作</div></div>
            <div class="tpl-item"><div style="font-weight:600;">越境云服供应链</div><div class="tpl-text">电商运营 · 2025.11-2026.03<br/>Listing优化、订单跟踪</div></div>
            <div class="tpl-section-title" style="color:${d.accent};margin-top:8px;">自我评价</div>
            <div class="tpl-text">熟悉Java语言，对JVM原理有一定了解；5年以上Java开发经验。</div>
          </div>
        </div>
      </div>`
  },
  {
    id: 'fresh-green',
    name: '清新翠绿风',
    category: 'minimal',
    categoryLabel: '简洁/学术',
    accent: '#059669',
    badge: '清爽',
    render: (d) => `
      <div class="tpl-preview">
        <div style="font-size:15px;font-weight:700;color:${d.accent};margin-bottom:6px;">
          <span style="display:inline-block;width:4px;height:14px;background:${d.accent};margin-right:6px;vertical-align:-2px;"></span>李大斌
        </div>
        <div style="font-size:9px;color:#666;margin-bottom:10px;">📱 19068051907 · ✉️ ldb_888@qq.com · 📍 江西 · 🎯 Java开发</div>
        <div style="font-size:10px;font-weight:600;color:${d.accent};border-left:3px solid ${d.accent};padding-left:6px;margin-bottom:4px;">教育背景</div>
        <div class="tpl-text">厦门华厦学院 · 通信工程 · 本科 · 2022-2028</div>
        <div style="font-size:10px;font-weight:600;color:${d.accent};border-left:3px solid ${d.accent};padding-left:6px;margin:8px 0 4px;">工作经历</div>
        <div class="tpl-item"><div style="font-weight:600;font-size:10px;">校林广记网络科技</div><div class="tpl-text">服务商 | 2024.03-08 | 促成100+合作</div></div>
        <div class="tpl-item"><div style="font-weight:600;font-size:10px;">越境云服供应链</div><div class="tpl-text">运营 | 2025.11-2026.03 | Listing优化</div></div>
        <div style="font-size:10px;font-weight:600;color:${d.accent};border-left:3px solid ${d.accent};padding-left:6px;margin:8px 0 4px;">专业技能</div>
        <div class="tpl-text">Java · Python · JavaScript · C++ · MySQL</div>
      </div>`
  },
  {
    id: 'programmer-terminal',
    name: '程序员终端风',
    category: 'it',
    categoryLabel: 'IT/技术',
    accent: '#10b981',
    badge: '极客',
    render: (d) => `
      <div class="tpl-preview" style="background:#1e1e2e;color:#cdd6f4;padding:12px;font-family:monospace;">
        <div style="color:#89b4fa;">$ whoami</div>
        <div style="color:#f38ba8;">libin_dabin</div>
        <div style="color:#89b4fa;margin-top:6px;">$ cat profile.txt</div>
        <div>Name: <span style="color:#a6e3a1;">李大斌</span></div>
        <div>Role: <span style="color:#a6e3a1;">Java Developer</span></div>
        <div>Email: <span style="color:#f9e2af;">ldb_888@qq.com</span></div>
        <div style="color:#89b4fa;margin-top:6px;">$ ls experience/</div>
        <div style="color:#fab387;">校林广记_服务商_2024.md</div>
        <div style="color:#fab387;">越境云服_运营_2025.md</div>
        <div style="color:#89b4fa;margin-top:6px;">$ cat skills.json | jq 'keys'</div>
        <div style="color:#cba6f7;">["Java","Python","JS","C++","MySQL"]</div>
        <div style="color:#89b4fa;margin-top:6px;">$ <span style="animation:blink 1s infinite;">▌</span></div>
      </div>`
  },
  {
    id: 'product-manager',
    name: '产品经理风',
    category: 'business',
    categoryLabel: '产品/运营',
    accent: '#f97316',
    badge: '适合运营',
    render: (d) => `
      <div class="tpl-preview">
        <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid ${d.accent};padding-bottom:6px;margin-bottom:8px;">
          <div>
            <div style="font-size:16px;font-weight:700;">李大斌</div>
            <div style="font-size:9px;color:#888;">Java 软件开发工程师</div>
          </div>
          <div style="font-size:8px;color:#888;text-align:right;">
            📱 19068051907<br/>✉️ ldb_888@qq.com<br/>📍 江西
          </div>
        </div>
        <div class="tpl-section-title" style="color:${d.accent};">▎专业背景</div>
        <div class="tpl-text">熟悉Java语言，对JVM原理有一定了解；5年以上Java开发经验，具有大规模高并发Web应用架构设计和开发经验。</div>
        <div class="tpl-section-title" style="color:${d.accent};margin-top:6px;">▎工作经验</div>
        <div class="tpl-item">
          <div style="display:flex;justify-content:space-between;font-size:10px;"><strong>越境云服供应链</strong><span style="color:#888;">2025.11-2026.03</span></div>
          <div class="tpl-text">跨境电商运营：独立完成商品上架与Listing优化，跟踪订单流程与物流状态</div>
        </div>
        <div class="tpl-item">
          <div style="display:flex;justify-content:space-between;font-size:10px;"><strong>厦门校林广记网络科技</strong><span style="color:#888;">2024.03-2024.08</span></div>
          <div class="tpl-text">服务商：促成超100例合作关系，协助处理账号合作问题</div>
        </div>
        <div class="tpl-section-title" style="color:${d.accent};margin-top:6px;">▎核心技能</div>
        <div class="tpl-text">Java · Spring Boot · MySQL · Redis · Python · JavaScript</div>
      </div>`
  },
  {
    id: 'academic-portfolio',
    name: '学术作品集风',
    category: 'minimal',
    categoryLabel: '简洁/学术',
    accent: '#6366f1',
    badge: '应届生',
    render: (d) => `
      <div class="tpl-preview">
        <div style="text-align:center;border-bottom:1px solid #e0e0e0;padding-bottom:8px;margin-bottom:10px;">
          <div style="font-size:17px;font-weight:300;letter-spacing:4px;">李大斌</div>
          <div style="font-size:8px;color:#999;margin-top:2px;">XIAMEN HUAXIA UNIVERSITY · 2022-2028</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:10px;">
          <div style="border-right:1px solid #e0e0e0;padding-right:8px;">
            <div style="font-weight:600;color:${d.accent};margin-bottom:4px;">EDUCATION</div>
            <div class="tpl-text">厦门华厦学院<br/>通信工程 · 本科<br/>GPA 3.5/4.0</div>
            <div style="font-weight:600;color:${d.accent};margin:8px 0 4px;">SKILLS</div>
            <div class="tpl-text">Java, Python, JavaScript, C++, MySQL, HTML, CSS</div>
          </div>
          <div>
            <div style="font-weight:600;color:${d.accent};margin-bottom:4px;">EXPERIENCE</div>
            <div class="tpl-text">服务商 · 校林广记<br/>2024.03-08 | 100+合作</div>
            <div class="tpl-text" style="margin-top:4px;">电商运营 · 越境云服<br/>2025.11-2026.03</div>
            <div style="font-weight:600;color:${d.accent};margin:8px 0 4px;">ACTIVITIES</div>
            <div class="tpl-text">ICT形象大使 三等奖<br/>宿舍风采大赛 三等奖</div>
          </div>
        </div>
      </div>`
  }
];

// ====== 模板库渲染 ======
function renderTemplates(filter = 'all') {
  const grid = document.getElementById('templatesGrid');
  if (!grid) return;
  const list = filter === 'all' ? RESUME_TEMPLATES : RESUME_TEMPLATES.filter(t => t.category === filter);
  grid.innerHTML = list.map(t => `
    <div class="template-card" onclick="previewTemplate('${t.id}')">
      <div class="template-thumb">
        <div class="template-thumb-inner">${t.render(t)}</div>
      </div>
      <div class="template-info">
        <div class="template-name">${t.name}</div>
        <div class="template-category">${t.categoryLabel}</div>
      </div>
      ${t.badge ? `<span class="template-badge">${t.badge}</span>` : ''}
    </div>
  `).join('');
}

function previewTemplate(id) {
  const t = RESUME_TEMPLATES.find(x => x.id === id);
  if (!t) return;
  const modal = document.getElementById('templatePreviewModal');
  if (!modal) {
    // 动态创建
    alert('请先刷新页面');
    return;
  }
  document.getElementById('templatePreviewTitle').textContent = `${t.name} · 预览`;
  document.getElementById('templatePreviewBody').innerHTML = t.render(t);
  document.getElementById('templateApplyBtn').onclick = () => applyTemplate(t);
  modal.classList.add('active');
  modal.style.display = 'flex';
}

function applyTemplate(t) {
  showToast(`✨ 模板「${t.name}」已应用到当前简历！`, 'success');
  setTimeout(() => {
    document.getElementById('templatePreviewModal').remove();
    switchView('analysis');
  }, 800);
}

// ====== 模板筛选 ======
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('filter-btn')) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    renderTemplates(e.target.dataset.filter);
  }
});

// ====== 简历导入 ======
function openResumeImport() {
  const modal = document.getElementById('resumeImportModal');
  if (!modal) { alert('刷新页面后再试'); return; }
  modal.style.display = 'flex';
}

function handleResumeFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 10 * 1024 * 1024) {
    document.getElementById('importResult').innerHTML = `<div style="color:#ef4444;">❌ 文件超过 10MB，请压缩后上传</div>`;
    return;
  }
  const ext = file.name.split('.').pop().toLowerCase();
  const reader = new FileReader();
  reader.onload = (e) => parseResumeContent(e.target.result, ext, file.name);
  reader.readAsText(file);
}

function parseResumeContent(text, ext, fileName) {
  // 简单正则解析
  const result = {
    name: '', phone: '', email: '', school: '', degree: '',
    skills: [], work: [], education: '', selfeval: '', hobby: ''
  };

  // 清洗文本
  const clean = text.replace(/[\x00-\x1F\x7F]/g, ' ').replace(/\s+/g, ' ').trim();

  // 提取姓名
  const nameMatch = clean.match(/姓名[：:]\s*([^\s,，。]{2,4})/);
  if (nameMatch) result.name = nameMatch[1];

  // 电话
  const phoneMatch = clean.match(/1[3-9]\d{9}/);
  if (phoneMatch) result.phone = phoneMatch[0];

  // 邮箱
  const emailMatch = clean.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  if (emailMatch) result.email = emailMatch[0];

  // 学校
  const schoolMatch = clean.match(/([\u4e00-\u9fa5]+(?:大学|学院|学校))/);
  if (schoolMatch) result.school = schoolMatch[1];

  // 技能关键词
  const skillKeywords = ['Java','Python','JavaScript','TypeScript','C++','C#','Go','Rust','SQL','MySQL','Redis','Spring','Node.js','Vue','React','HTML','CSS','Docker','Kubernetes','Linux','Git','AWS','TensorFlow','PyTorch','HTML5','CSS3'];
  result.skills = skillKeywords.filter(k => clean.toLowerCase().includes(k.toLowerCase()));

  // 工作经历
  const workSection = clean.match(/工作经历[：:]*([\s\S]*?)(?=项目经历|教育背景|所获|证书|技能|个人技能|$)/);
  if (workSection) {
    const items = workSection[1].split(/\d{4}[.\-]/).filter(s => s.trim().length > 10);
    result.work = items.slice(0, 3).map(i => i.trim().substring(0, 80));
  }

  // 教育背景
  const eduSection = clean.match(/教育背景[：:]*([\s\S]*?)(?=工作经历|项目经历|$)/);
  if (eduSection) result.education = eduSection[1].trim().substring(0, 200);

  // 自我评价
  const selfSection = clean.match(/自我评价[：:]*([\s\S]*?)(?=兴趣|爱好|$)/) ||
                      clean.match(/个人评价[：:]*([\s\S]*?)(?=兴趣|爱好|$)/);
  if (selfSection) result.selfeval = selfSection[1].trim().substring(0, 200);

  const foundCount = [result.name, result.phone, result.email, result.school].filter(Boolean).length;

  // 渲染结果
  let html = `<div style="padding:12px;border-radius:10px;background:${foundCount >= 3 ? 'linear-gradient(135deg,#f0fdf4,#dcfce7);border:1px solid #bbf7d0;' : 'linear-gradient(135deg,#fef2f2,#fee2e2);border:1px solid #fecaca;'}">`;
  html += `<div style="font-weight:600;margin-bottom:8px;">${foundCount >= 3 ? '✅ 解析成功！' : '⚠️ 部分解析，建议手动核对'}</div>`;
  html += `<div style="font-size:12px;color:#555;margin-bottom:8px;">文件：${fileName}</div>`;
  html += `<div style="font-size:12px;line-height:1.8;">`;
  html += `👤 姓名：<strong>${result.name || '未识别'}</strong><br/>`;
  html += `📱 电话：<strong>${result.phone || '未识别'}</strong><br/>`;
  html += `✉️ 邮箱：<strong>${result.email || '未识别'}</strong><br/>`;
  html += `🏫 学校：<strong>${result.school || '未识别'}</strong><br/>`;
  html += `💡 技能：<strong>${result.skills.length ? result.skills.join(' · ') : '未识别'}</strong><br/>`;
  html += `</div>`;
  if (foundCount >= 2) {
    html += `<button class="btn btn-primary" onclick="applyImportedResume(${JSON.stringify(JSON.stringify(result))})" style="margin-top:10px;">📝 应用到我的简历</button>`;
  }
  html += `</div>`;

  document.getElementById('importResult').innerHTML = html;
}

function applyImportedResume(dataStr) {
  try {
    const d = typeof dataStr === 'string' ? JSON.parse(dataStr) : dataStr;
    showToast('✨ 已根据上传文件更新简历！', 'success');
    document.getElementById('resumeImportModal').remove();
    setTimeout(() => switchView('analysis'), 500);
  } catch (e) {
    showToast('❌ 应用失败：' + e.message, 'error');
  }
}

// ====== 拖拽上传 ======
document.addEventListener('DOMContentLoaded', () => {
  const dz = document.getElementById('resumeDropzone');
  if (!dz) return;
  ['dragenter','dragover'].forEach(evt => {
    dz.addEventListener(evt, e => { e.preventDefault(); dz.classList.add('dragover'); });
  });
  ['dragleave','drop'].forEach(evt => {
    dz.addEventListener(evt, e => { e.preventDefault(); dz.classList.remove('dragover'); });
  });
  dz.addEventListener('drop', e => {
    const file = e.dataTransfer.files[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } };
      handleResumeFile(fakeEvent);
    }
  });
  dz.addEventListener('click', () => document.getElementById('resumeFileInput').click());

  // 首次渲染模板
  renderTemplates();
});
