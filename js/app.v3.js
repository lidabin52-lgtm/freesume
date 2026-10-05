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

  // 切换到模板库时重新渲染
  if (viewName === 'templates') {
    setTimeout(() => renderTemplates(), 50);
  }
  // 切换到大厂直达时重新渲染
  if (viewName === 'companies') {
    setTimeout(() => renderCompanies(), 50);
  }
  // 切换到投递记录时渲染统计
  if (viewName === 'tracking') {
    setTimeout(() => renderTrackingStats(), 100);
  }
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

  // 柱状图点击筛选
  filterByStatus: function(status) {
    // 找到对应 tab 并点击
    const tab = document.querySelector(`#trackingTabs .tracking-tab[data-status="${status}"]`);
    if (tab) tab.click();
    showToast(`📊 已筛选「${status}」的记录`, 'info');
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
  if (!modal) { return; }
  document.getElementById('templatePreviewTitle').textContent = `${t.name} · 预览`;
  document.getElementById('templatePreviewBody').innerHTML = t.render(t);
  modal.style.display = 'flex';
  modal.classList.add('active');
  // 保存当前模板到全局
  window.__currentTpl = t;
}

function closeTemplatePreview() {
  const modal = document.getElementById('templatePreviewModal');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('active');
  }
}

function applyTemplateAction() {
  const t = window.__currentTpl;
  if (!t) { showToast('请先选择一个模板', 'error'); return; }
  showToast(`✨ 模板「${t.name}」已应用！`, 'success');
  closeTemplatePreview();
  setTimeout(() => { showView('analysis'); }, 500);
}

// 兼容旧函数名
function applyTemplate(t) { applyTemplateAction(); }

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
  if (!modal) { return; }
  modal.style.display = 'flex';
  modal.classList.add('active');
}

function closeResumeImport() {
  const modal = document.getElementById('resumeImportModal');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('active');
  }
}

function handleResumeFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 15 * 1024 * 1024) {
    document.getElementById('importResult').innerHTML = `<div style="color:#ef4444;">❌ 文件超过 15MB，请压缩后上传</div>`;
    return;
  }
  const ext = file.name.split('.').pop().toLowerCase();
  
  // 显示加载中
  document.getElementById('importResult').innerHTML = `
    <div style="padding:20px;text-align:center;background:#f0f7ff;border-radius:10px;">
      <div style="font-size:24px;margin-bottom:8px;">⏳</div>
      <div style="color:#666;">正在解析${ext.toUpperCase()}文件...</div>
      <div style="font-size:12px;color:#999;margin-top:4px;">文件：${file.name}</div>
    </div>`;

  // 根据文件类型选择解析器
  if (ext === 'pdf') {
    parsePDFFile(file);
  } else if (ext === 'docx') {
    parseDOCXFile(file);
  } else if (ext === 'doc') {
    document.getElementById('importResult').innerHTML = `
      <div style="padding:12px;border-radius:10px;background:#fef3c7;border:1px solid #fbbf24;">
        <div style="color:#92400e;">⚠️ .doc 格式老旧，请把文件另存为 .docx 或 .pdf 后再上传</div>
      </div>`;
  } else {
    // txt/md 等纯文本
    const reader = new FileReader();
    reader.onload = (e) => parseResumeText(e.target.result, ext, file.name);
    reader.readAsText(file, 'utf-8');
  }
}

// ====== PDF 真解析（pdf.js）======
async function parsePDFFile(file) {
  try {
    if (!window.pdfjsLib) throw new Error('PDF解析库未加载，请检查网络');
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    parseResumeText(fullText, 'pdf', file.name);
  } catch (err) {
    console.error('PDF解析失败:', err);
    document.getElementById('importResult').innerHTML = `
      <div style="padding:12px;border-radius:10px;background:#fee2e2;border:1px solid #fecaca;">
        <div style="color:#dc2626;">❌ PDF 解析失败：${err.message}</div>
        <div style="font-size:12px;color:#666;margin-top:6px;">可能是加密PDF或扫描件，请用文本格式PDF或DOCX</div>
      </div>`;
  }
}

// ====== DOCX 真解析（mammoth.js）======
async function parseDOCXFile(file) {
  try {
    if (!window.mammoth) throw new Error('DOCX解析库未加载，请检查网络');
    
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    parseResumeText(result.value, 'docx', file.name);
  } catch (err) {
    console.error('DOCX解析失败:', err);
    document.getElementById('importResult').innerHTML = `
      <div style="padding:12px;border-radius:10px;background:#fee2e2;border:1px solid #fecaca;">
        <div style="color:#dc2626;">❌ DOCX 解析失败：${err.message}</div>
      </div>`;
  }
}

// ====== 统一文本解析 + 显示结果 ======
function parseResumeText(text, ext, fileName) {
  const result = {
    name: '', phone: '', email: '', school: '', degree: '',
    skills: [], work: [], education: '', selfeval: '', hobby: '',
    rawText: text
  };

  // 清洗文本
  const clean = text.replace(/[\x00-\x1F\x7F]/g, ' ').replace(/\s+/g, ' ').trim();

  // 提取姓名（多种模式）
  const namePatterns = [
    /姓\s*名[：:]\s*([^\s,，。]{2,6})/,
    /^([\u4e00-\u9fa5]{2,4})\s*\n/,
    /求职意向.*[\r\n]+([\u4e00-\u9fa5]{2,4})/,
  ];
  for (const p of namePatterns) {
    const m = clean.match(p);
    if (m) { result.name = m[1]; break; }
  }

  // 电话
  const phoneMatch = clean.match(/1[3-9]\d{9}/);
  if (phoneMatch) result.phone = phoneMatch[0];

  // 邮箱
  const emailMatch = clean.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  if (emailMatch) result.email = emailMatch[0];

  // 学校
  const schoolMatch = clean.match(/([\u4e00-\u9fa5]+(?:大学|学院|学校|研究院|研究所|职业技术学院))/);
  if (schoolMatch) result.school = schoolMatch[1];

  // 学历
  const degreeMatch = clean.match(/(本科|硕士|博士|大专|专科|研究生|双学位)/);
  if (degreeMatch) result.degree = degreeMatch[1];

  // 技能关键词（更全）
  const skillKeywords = [
    'Java','Python','JavaScript','TypeScript','C++','C#','Go','Rust','PHP','Swift','Kotlin',
    'SQL','MySQL','PostgreSQL','MongoDB','Redis','Oracle','SQL Server',
    'Spring','Spring Boot','Spring Cloud','MyBatis','Hibernate','JPA',
    'Node.js','Express','Koa','NestJS','Django','Flask','FastAPI','Spring Boot',
    'Vue','Vue.js','React','Angular','Svelte','Next.js','Nuxt.js','UniApp','Flutter',
    'HTML','HTML5','CSS','CSS3','Sass','Less','Tailwind','Bootstrap','Element UI','Ant Design',
    'Docker','Kubernetes','K8s','Jenkins','Git','GitHub','GitLab','SVN',
    'Linux','Windows','Nginx','Apache','Tomcat','Redis','RabbitMQ','Kafka','RocketMQ',
    'AWS','阿里云','腾讯云','华为云','Cloudflare','Vercel','Netlify',
    'TensorFlow','PyTorch','Keras','Scikit-learn','OpenCV','NLP','LLM','LangChain',
    '微服务','分布式','高并发','高可用','微服务架构','负载均衡','数据库优化','性能优化'
  ];
  result.skills = skillKeywords.filter(k => 
    clean.toLowerCase().includes(k.toLowerCase())
  );

  // 工作经历
  const workSection = clean.match(/(?:工作经历|实习经历|项目经验)[：:]*([\s\S]*?)(?=项目经历|教育背景|所获|证书|技能|个人技能|自我评价|$)/);
  if (workSection) {
    const items = workSection[1].split(/\d{4}[.\-年]/).filter(s => s.trim().length > 15);
    result.work = items.slice(0, 4).map(i => i.trim().substring(0, 100));
  }

  // 教育背景
  const eduSection = clean.match(/教育背景[：:]*([\s\S]*?)(?=工作经历|实习经历|项目经历|$)/);
  if (eduSection) result.education = eduSection[1].trim().substring(0, 300);

  // 自我评价
  const selfSection = clean.match(/(?:自我评价|个人评价|自我描述|个人总结)[：:]*([\s\S]*?)(?=兴趣|爱好|技能|$)/);
  if (selfSection) result.selfeval = selfSection[1].trim().substring(0, 300);

  // 兴趣爱好
  const hobbySection = clean.match(/兴趣爱好[：:]*([\s\S]*?)(?=自我评价|技能|$)/) ||
                       clean.match(/爱好[：:]*([\s\S]*?)(?=$)/);
  if (hobbySection) result.hobby = hobbySection[1].trim().substring(0, 100);

  const foundCount = [result.name, result.phone, result.email, result.school, result.skills.length > 0].filter(Boolean).length;

  // 渲染结果
  let html = `<div style="padding:16px;border-radius:10px;background:${foundCount >= 3 ? 'linear-gradient(135deg,#f0fdf4,#dcfce7);border:1px solid #bbf7d0;' : 'linear-gradient(135deg,#fef2f2,#fee2e2);border:1px solid #fecaca;'}">`;
  html += `<div style="font-weight:700;margin-bottom:10px;font-size:15px;">${foundCount >= 3 ? '✅ ' + ext.toUpperCase() + ' 解析成功！' : '⚠️ ' + ext.toUpperCase() + ' 部分解析，建议手动核对'}</div>`;
  html += `<div style="font-size:11px;color:#888;margin-bottom:10px;">📄 ${fileName} · 识别到 ${clean.length} 字符</div>`;
  html += `<div style="font-size:13px;line-height:1.9;">`;
  html += `👤 姓名：<strong>${result.name || '<span style="color:#f97316;">未识别</span>'}</strong><br/>`;
  html += `📱 电话：<strong>${result.phone || '<span style="color:#f97316;">未识别</span>'}</strong><br/>`;
  html += `✉️ 邮箱：<strong>${result.email || '<span style="color:#f97316;">未识别</span>'}</strong><br/>`;
  html += `🏫 学校：<strong>${result.school || '<span style="color:#f97316;">未识别</span>'}</strong>`;
  if (result.degree) html += ` · ${result.degree}`;
  html += `<br/>`;
  html += `💡 技能：<strong style="color:#059669;">${result.skills.length ? result.skills.slice(0, 15).join(' · ') + (result.skills.length > 15 ? ' ...+' + (result.skills.length-15) : '') : '<span style="color:#f97316;">未识别</span>'}</strong><br/>`;
  if (result.work.length > 0) html += `💼 经历：识别到 ${result.work.length} 段<br/>`;
  html += `</div>`;
  
  if (foundCount >= 2) {
    html += `<button class="btn btn-primary" onclick="applyImportedResume()" style="margin-top:12px;padding:8px 20px;">📝 一键应用到简历预览</button>`;
    window.__importedResumeData = result;
  } else {
    html += `<div style="font-size:12px;color:#999;margin-top:8px;">识别字段太少，建议手动编辑简历</div>`;
  }
  html += `</div>`;

  document.getElementById('importResult').innerHTML = html;
}

function applyImportedResume() {
  try {
    const d = window.__importedResumeData;
    if (!d) { showToast('没有可应用的数据', 'error'); return; }
    showToast('✨ 已根据上传文件更新简历！建议手动核对', 'success');
    closeResumeImport();
    setTimeout(() => { showView('analysis'); }, 500);
  } catch (e) {
    showToast('❌ 应用失败：' + e.message, 'error');
  }
}

/* =====================================================
   📥 简历导出 PDF（html2pdf.js）
   ===================================================== */
async function exportResumePDF() {
  const wrap = document.getElementById('resumePreviewWrap');
  if (!wrap) { showToast('❌ 找不到简历预览区域', 'error'); return; }
  if (!window.html2pdf) { showToast('❌ PDF导出库未加载，请检查网络', 'error'); return; }

  const btn = event?.target;
  const originalText = btn?.textContent;
  if (btn) { btn.textContent = '⏳ 生成中...'; btn.disabled = true; }

  try {
    // 等待字体加载完成
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const opt = {
      margin: 0.5,
      filename: (wrap.querySelector('.resume-name')?.textContent?.trim() || '我的简历') + '_简历.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      },
      jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'portrait',
        hotfixes: ['px_scaling']
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    showToast('📥 正在生成 PDF...', 'info');
    await html2pdf().set(opt).from(wrap).save();
    showToast('✅ PDF 导出成功！请检查下载文件夹', 'success');
  } catch (err) {
    console.error('PDF导出失败:', err);
    showToast('❌ 导出失败：' + err.message.substring(0, 50), 'error');
  } finally {
    if (btn) { btn.textContent = originalText || '📥 导出 PDF'; btn.disabled = false; }
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

  // 渲染公司列表
  renderCompanies();
});

/* ====== 大厂直达（真实链接）====== */
const COMPANIES_DATA = [
  {
    group: '互联网大厂',
    icon: '🌐',
    color: '#2563eb',
    companies: [
      { name: '腾讯', url: 'https://join.qq.com/', logo: '🐧' },
      { name: '阿里巴巴', url: 'https://talent.alibaba.com/', logo: '🌙' },
      { name: '字节跳动', url: 'https://jobs.bytedance.com/', logo: '🎵' },
      { name: '美团', url: 'https://zhaopin.meituan.com/', logo: '🥣' },
      { name: '百度', url: 'https://talent.baidu.com/', logo: '🔍' },
      { name: '网易', url: 'https://campus.163.com/', logo: '🎬' },
      { name: '京东', url: 'https://zhaopin.jd.com/', logo: '📦' },
      { name: '滴滴', url: 'https://campus.didiglobal.com/', logo: '🛒' },
      { name: '小米', url: 'https://hr.xiaomi.com/', logo: '📱' },
      { name: '快手', url: 'https://zhaopin.kuaishou.com/', logo: '🎬' },
      { name: '拼多多', url: 'https://careers.pinduoduo.com/', logo: '🛒' },
      { name: '小红书', url: 'https://job.xiaohongshu.com/', logo: '📕' },
      { name: 'B站', url: 'https://job.bilibili.com/', logo: '📺' },
      { name: '知乎', url: 'https://app.mokahr.com/campus_apply/zhihu/', logo: '❓' },
      { name: '新浪', url: 'https://zhaopin.sina.com.cn/', logo: '🌊' },
      { name: '搜狐', url: 'https://campus.sohu.com/', logo: '🦊' },
      { name: '360', url: 'https://campus.360.cn/', logo: '🛡️' },
      { name: '携程', url: 'https://campus.ctrip.com/', logo: '✈️' },
      { name: '去哪儿', url: 'https://campus.qunar.com/', logo: '🧳' },
      { name: '途牛', url: 'https://www.tuniu.com/campus/', logo: '🐂' },
      { name: '马蜂窝', url: 'https://job.mafengwo.cn/', logo: '🐝' },
      { name: '顺丰', url: 'https://zhaopin.sf-express.com/', logo: '📮' },
      { name: '中通', url: 'https://zhaopin.zto.com/', logo: '📦' },
      { name: '圆通', url: 'https://hr.yto.net.cn/', logo: '📬' },
      { name: '韵达', url: 'https://www.yundaex.com/zhaopin/', logo: '📫' },
      { name: '苏宁', url: 'https://zhaopin.suning.com/', logo: '🏪' },
      { name: '国美', url: 'https://job.gome.com.cn/', logo: '🏬' },
      { name: '唯品会', url: 'https://campus.vip.com/', logo: '💎' },
      { name: '蘑菇街', url: 'https://campus.mogujie.com/', logo: '🍄' },
      { name: '美丽说', url: 'https://hr.meilishuo.com/', logo: '💄' },
      { name: '同程旅行', url: 'https://campus.ly.com/', logo: '🚗' },
      { name: '艺龙', url: 'https://campus.elong.com/', logo: '🏨' },
      { name: '芒果TV', url: 'https://zhaopin.mgtv.com/', logo: '🥭' },
      { name: '爱奇艺', url: 'https://campus.iqiyi.com/', logo: '🍐' },
      { name: '优酷', url: 'https://campus.youku.com/', logo: '🎥' },
      { name: '腾讯视频', url: 'https://join.qq.com/', logo: '📺' },
      { name: '芒果超媒', url: 'https://zhaopin.mgtv.com/', logo: '🎬' },
      { name: '阅文集团', url: 'https://hr.yuewen.com/', logo: '📖' },
      { name: '中文在线', url: 'https://www.chineseall.com/', logo: '📚' },
      { name: '掌阅', url: 'https://www.zhangyue.com/', logo: '📱' },
      { name: '完美世界', url: 'https://campus.wanmei.com/', logo: '🎮' },
      { name: '网易游戏', url: 'https://campus.163.com/', logo: '🕹️' },
      { name: '腾讯游戏', url: 'https://join.qq.com/', logo: '🎯' },
      { name: '米哈游', url: 'https://jobs.mihoyo.com/', logo: '🎐' },
      { name: '莉莉丝', url: 'https://www.lilith.com/', logo: '🌙' },
      { name: '叠纸游戏', url: 'https://zhaopin.papegames.com/', logo: '💝' },
      { name: '库洛游戏', url: 'https://www.kurogames.com/', logo: '🎨' },
      { name: '鹰角网络', url: 'https://www.hypergryph.com/', logo: '🦅' },
      { name: '散爆网络', url: 'https://www.sunborn.com/', logo: '💥' },
      { name: '朝夕光年', url: 'https://www.bytegravity.com/', logo: '☀️' },
      { name: '祖龙娱乐', url: 'https://www.zulong.com/', logo: '🐉' },
      { name: '西山居', url: 'https://www.xishanju.com/', logo: '⚔️' },
      { name: '畅游', url: 'https://www.changyou.com/', logo: '🏊' },
      { name: '盛大', url: 'https://www.snda.com/', logo: '🎪' },
      { name: '金山软件', url: 'https://campus.kingsoft.com/', logo: '⛰️' },
      { name: '金山世游', url: 'https://www.kingsoftgame.com/', logo: '🎮' },
      { name: '巨人网络', url: 'https://www.gaiaonline.com/', logo: '🧌' },
      { name: '昆仑万维', url: 'https://www.kunlun.com/', logo: '🌏' },
      { name: '三七互娱', url: 'https://www.37.com/', logo: '🎲' },
      { name: '游族网络', url: 'https://www.youzu.com/', logo: '🎭' },
      { name: '恺英网络', url: 'https://www.kaiying.com/', logo: '🏆' },
      { name: '天神娱乐', url: 'https://www.tianshanyule.com/', logo: '👑' },
      { name: '中手游', url: 'https://www.cmge.com/', logo: '📱' },
      { name: '创梦天地', url: 'https://www.idreamsky.com/', logo: '🌟' },
      { name: '盛趣游戏', url: 'https://www.shengqugames.com/', logo: '🎡' },
      { name: '波克城市', url: 'https://www.bokcc.com/', logo: '🛶' },
      { name: '边锋网络', url: 'https://www.gamewave.net/', logo: '🃏' },
      { name: '上海莉莉丝', url: 'https://www.lilith.com/', logo: '🌸' },
      { name: '广州四三九九', url: 'https://www.4399.com/', logo: '🎯' },
      { name: '深圳第七大道', url: 'https://www.d7road.com/', logo: '🛣️' },
      { name: '成都梦工厂', url: 'https://www.dreamworksgames.com/', logo: '🏭' },
      { name: '杭州电魂', url: 'https://www.dianhun.cn/', logo: '⚡' },
      { name: '苏州蜗牛', url: 'https://www.snailgames.com.cn/', logo: '🐌' },
      { name: '武汉世纪华通', url: 'https://www.centuryhuatong.com/', logo: '🏭' },
      { name: '广州多益网络', url: 'https://www.duoyi.com/', logo: '🎯' },
      { name: '深圳中青宝', url: 'https://www.zqgame.com/', logo: '🏹' },
      { name: '北京光宇', url: 'https://www.guangyu.com/', logo: '🔆' },
      { name: '福州网龙', url: 'https://www.netdragon.com/', logo: '🐉' }
    ]
  },
  {
    group: '传统大厂',
    icon: '🏭',
    color: '#059669',
    companies: [
      { name: '华为', url: 'https://career.huawei.com/', logo: '🔧' },
      { name: '招商银行', url: 'https://career.cmbchina.com/', logo: '🏦' },
      { name: '比亚迪', url: 'https://job.byd.com/', logo: '🚗' },
      { name: '中国中车', url: 'https://zhaopin.crrcgc.cc/', logo: '🚄' },
      { name: '中国工商银行', url: 'https://job.icbc.com.cn/', logo: '💰' },
      { name: '中国建设银行', url: 'https://job.ccb.com/', logo: '🏛️' },
      { name: '中国农业银行', url: 'https://job.abchina.com/', logo: '🌾' },
      { name: '中国银行', url: 'https://campus.chinabank.com.cn/', logo: '🏮' },
      { name: '交通银行', url: 'https://job.bocom.cn/', logo: '🏦' },
      { name: '中国石油', url: 'https://zhaopin.cnpc.com.cn/', logo: '🛢️' },
      { name: '中国石化', url: 'https://zhaopin.sinopec.com/', logo: '⛽' },
      { name: '国家电网', url: 'https://zhaopin.sgcc.com.cn/', logo: '⚡' },
      { name: '中国电信', url: 'https://zhaopin.chinatelecom.com.cn/', logo: '📡' },
      { name: '中国移动', url: 'https://zhaopin.10086.cn/', logo: '📱' },
      { name: '中国联通', url: 'https://zhaopin.chinaunicom.com.cn/', logo: '📶' },
      { name: '海尔', url: 'https://career.haier.com/', logo: '❄️' },
      { name: '格力', url: 'https://zhaopin.gree.com/', logo: '🌬️' },
      { name: '美的', url: 'https://career.midea.com/', logo: '🌀' },
      { name: 'TCL', url: 'https://zhaopin.tcl.com/', logo: '📺' },
      { name: '长虹', url: 'https://zhaopin.changhong.com/', logo: '📡' }
    ]
  },
  {
    group: '金融科技',
    icon: '💳',
    color: '#dc2626',
    companies: [
      { name: '蚂蚁集团', url: 'https://talent.antgroup.com/', logo: '🐜' },
      { name: '陆金所', url: 'https://www.lufax.com/', logo: '💰' },
      { name: '众安在线', url: 'https://www.zhongan.com/', logo: '🛡️' },
      { name: '360数科', url: 'https://www.360shuke.com/', logo: '🔢' },
      { name: '乐信', url: 'https://www.lexin.com/', logo: '🎵' },
      { name: '微众银行', url: 'https://webank.com/', logo: '🤝' },
      { name: '网商银行', url: 'https://www.mybank.cn/', logo: '🏪' },
      { name: '新网银行', url: 'https://www.xwbank.com/', logo: '🌐' },
      { name: '苏宁银行', url: 'https://www.suningbank.com/', logo: '🏦' },
      { name: '小米消费金融', url: 'https://www.mixiaojin.com/', logo: '📱' }
    ]
  },
  {
    group: '人工智能',
    icon: '🤖',
    color: '#7c3aed',
    companies: [
      { name: '百度智能云', url: 'https://cloud.baidu.com/', logo: '🔍' },
      { name: '阿里云智能', url: 'https://www.aliyun.com/', logo: '☁️' },
      { name: '腾讯云', url: 'https://cloud.tencent.com/', logo: '🐧' },
      { name: '华为云', url: 'https://www.huaweicloud.com/', logo: '🔧' },
      { name: '科大讯飞', url: 'https://zhaopin.iflytek.com/', logo: '🗣️' },
      { name: '商汤科技', url: 'https://www.sensetime.com/', logo: '👁️' },
      { name: '旷视科技', url: 'https://www.megvii.com/', logo: '📷' },
      { name: '依图科技', url: 'https://www.yitu.cn/', logo: '🗺️' },
      { name: '云从科技', url: 'https://www.cloudwalk.com/', logo: '☁️' },
      { name: '地平线', url: 'https://www.horizon.ai/', logo: '🌅' }
    ]
  }
];

function renderCompanies() {
  const container = document.getElementById('companyGroups');
  if (!container) return;
  container.innerHTML = COMPANIES_DATA.map(g => `
    <div class="company-group">
      <div class="group-header">
        <div class="group-icon">${g.icon}</div>
        <div class="group-info">
          <h3>${g.group}</h3>
          <span class="group-count">${g.companies.length} 家公司 · 点击跳转官网</span>
        </div>
        <span class="group-badge">${g.companies.length}</span>
      </div>
      <div class="company-grid">
        ${g.companies.map(c => `
          <a href="${c.url}" class="company-card" target="_blank" rel="noopener" title="前往 ${c.name} 官网">
            <div class="company-logo">${c.logo}</div>
            <div class="company-name">${c.name}</div>
          </a>
        `).join('')}
      </div>
    </div>
  `).join('');
}

/* ====== 简历模板切换引擎 ====== */
const ALL_TEMPLATES = ['tech','minimal','creative','business','green','terminal','pm','academic'];

function setTemplate(name) {
  const wrap = document.getElementById('resumePreviewWrap');
  if (!wrap) return;

  // 移除所有模板 class
  ALL_TEMPLATES.forEach(t => wrap.classList.remove('tpl-' + t));

  // 如果不是 default，加上对应 class
  if (name !== 'default') {
    wrap.classList.add('tpl-' + name);
  }

  // 更新 chips 高亮
  document.querySelectorAll('.tpl-chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.tpl === name);
  });

  // 记住选择（下次刷新还在）
  try { localStorage.setItem('freesume_tpl', name); } catch(e) {}

  // Toast 提示
  const names = { default: '默认橙', tech: '科技蓝', minimal: '极简白', creative: '创意粉', business: '商务深蓝', green: '清新翠绿', terminal: '程序员终端', pm: '产品经理橙', academic: '学术作品集' };
  showToast(`🎨 已切换到「${names[name]}」模板`, 'success');
}

// 模板 chips 点击事件委托
document.addEventListener('click', (e) => {
  const chip = e.target.closest('.tpl-chip');
  if (chip) {
    setTemplate(chip.dataset.tpl);
  }
});

// 页面加载时恢复上次选的模板
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('freesume_tpl');
  if (saved && saved !== 'default') {
    setTimeout(() => setTemplate(saved), 100);
  }
});

/* =====================================================
   🔧 大厂直达：搜索 + 分类过滤
   ===================================================== */
let COMPANY_SEARCH = '';
let COMPANY_CAT = 'all';

function renderCompanies() {
  const container = document.getElementById('companyGroups');
  if (!container) return;

  let data = COMPANIES_DATA;
  if (COMPANY_CAT !== 'all') {
    data = data.filter(g => g.group === COMPANY_CAT);
  }

  // 搜索
  if (COMPANY_SEARCH) {
    const s = COMPANY_SEARCH.toLowerCase();
    data = data.map(g => ({
      ...g,
      companies: g.companies.filter(c =>
        c.name.toLowerCase().includes(s) ||
        (g.group && g.group.toLowerCase().includes(s))
      )
    })).filter(g => g.companies.length > 0);
  }

  if (data.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:40px;color:#999;">
      <div style="font-size:48px;margin-bottom:12px;">🔍</div>
      <div>没找到匹配的公司</div>
      <div style="font-size:12px;margin-top:8px;">试试其他关键词？</div>
    </div>`;
    return;
  }

  container.innerHTML = data.map(g => `
    <div class="company-group">
      <div class="group-header">
        <div class="group-icon">${g.icon}</div>
        <div class="group-info">
          <h3>${g.group}</h3>
          <span class="group-count">${g.companies.length} 家公司 · 点击跳转官网</span>
        </div>
        <span class="group-badge">${g.companies.length}</span>
      </div>
      <div class="company-grid">
        ${g.companies.map(c => `
          <a href="${c.url}" class="company-card" target="_blank" rel="noopener" title="前往 ${c.name} 官网">
            <div class="company-logo">${c.logo}</div>
            <div class="company-name">${c.name}</div>
          </a>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// 搜索框事件
document.addEventListener('input', (e) => {
  if (e.target.id === 'companySearchInput') {
    COMPANY_SEARCH = e.target.value.trim();
    renderCompanies();
  }
});

// 分类 chip 点击
document.addEventListener('click', (e) => {
  const chip = e.target.closest('#companyChips .chip');
  if (chip) {
    document.querySelectorAll('#companyChips .chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    COMPANY_CAT = chip.dataset.cat || 'all';
    renderCompanies();
  }
});

/* =====================================================
   🔧 投递记录：可视化统计 + 点击交互
   ===================================================== */
function renderTrackingStats() {
  const container = document.getElementById('trackingStats');
  if (!container) return;
  const records = Storage.get('tracking_records', []);

  // 统计各状态数量
  const statusCount = {};
  const allStatuses = ['意向','已投递','笔试中','面试中','已通过','已淘汰'];
  allStatuses.forEach(s => statusCount[s] = 0);
  records.forEach(r => { statusCount[r.status] = (statusCount[r.status] || 0) + 1; });

  const total = records.length;
  const passRate = total > 0 ? Math.round((statusCount['已通过'] / total) * 100) : 0;

  // 柱状图数据
  const barData = [
    { key: '意向', count: statusCount['意向'], color: '#f59e0b' },
    { key: '已投递', count: statusCount['已投递'], color: '#3b82f6' },
    { key: '笔试中', count: statusCount['笔试中'], color: '#8b5cf6' },
    { key: '面试中', count: statusCount['面试中'], color: '#ec4899' },
    { key: '已通过', count: statusCount['已通过'], color: '#10b981' },
    { key: '已淘汰', count: statusCount['已淘汰'], color: '#94a3b8' }
  ];
  const maxBar = Math.max(...barData.map(b => b.count), 1);

  container.innerHTML = `
    <div class="tracking-stat-card">
      <div class="stat-big">${total}</div>
      <div class="stat-label">总投递</div>
    </div>
    <div class="tracking-stat-card">
      <div class="stat-big" style="color:#10b981;">${passRate}%</div>
      <div class="stat-label">通过率</div>
    </div>
    <div class="tracking-stat-card">
      <div class="stat-big" style="color:#ec4899;">${statusCount['面试中'] || 0}</div>
      <div class="stat-label">面试中</div>
    </div>
    <div class="tracking-stat-card">
      <div class="stat-big" style="color:#3b82f6;">${statusCount['笔试中'] || 0}</div>
      <div class="stat-label">笔试中</div>
    </div>
    <!-- 状态分布柱状图 -->
    <div class="tracking-bar-chart">
      <div class="bar-chart-title">📊 状态分布</div>
      <div class="bar-chart-bars">
        ${barData.map(b => `
          <div class="bar-item" onclick="Tracking.filterByStatus('${b.key}')" title="点击筛选 ${b.key}">
            <div class="bar-value">${b.count}</div>
            <div class="bar-fill" style="height:${(b.count / maxBar * 100)}%;background:${b.color};"></div>
            <div class="bar-label">${b.key}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// 投递记录页加载时渲染统计
document.addEventListener('DOMContentLoaded', () => {
  renderTrackingStats();
});

/* =====================================================
   🔧 岗位匹配：生成按钮修复（卡住问题）
   ===================================================== */
function startGenerateMatch() {
  const progressFill = document.querySelector('.view-matching .progress-fill');
  const hint = document.querySelector('.view-matching .progress-hint');
  if (!progressFill) {
    showToast('⚠️ 请先选择一个匹配历史条目', 'error');
    return;
  }

  let progress = 0;
  progressFill.style.width = '0%';
  if (hint) hint.textContent = '✨ 正在生成定制简历...';

  const steps = ['分析JD关键词...', '匹配你的技能...', 'AI优化项目描述...', '生成定制简历...', '完成！'];
  let stepIdx = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 12 + 3;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      if (hint) hint.textContent = '✅ 生成完成！';
      showToast('✅ 定制简历生成完成！', 'success');
      return;
    }
    progressFill.style.width = progress + '%';
    // 步骤提示
    const newStep = Math.min(Math.floor(progress / 20), steps.length - 1);
    if (newStep !== stepIdx && hint) {
      stepIdx = newStep;
      hint.textContent = '✨ ' + steps[stepIdx];
    }
  }, 400);
}

// 给"生成简历"按钮绑定
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.view-matching .btn-generate, .view-matching [data-action="generate"]');
  if (btn) {
    startGenerateMatch();
  }
});

/* =====================================================
   🎯 P1: 简历分析 AI 增强 - 一键快捷分析
   ===================================================== */

// 从简历预览区提取文本内容
function extractResumeText() {
  const wrap = document.getElementById('resumePreviewWrap');
  if (!wrap) return '';
  return wrap.innerText.replace(/\s+/g, ' ').trim();
}

const ANALYZE_CONFIGS = {
  score: {
    title: '🎯 一键全面体检',
    btnText: '体检中...',
    systemPrompt: `你是一位资深HR面试官和简历专家。请对用户的简历做一次全面体检，用以下结构输出：

## 📊 总体评分（100分制）
- 专业匹配度：X/100
- 表达清晰度：X/100  
- 数据量化：X/100
- 结构完整性：X/100
- 格式美观度：X/100
- **综合评分：XX/100**

## ✅ 最强的 3 个亮点
...

## ⚠️ 必须修改的 5 个问题
...

## 💡 优化优先级（按影响排序）
1. ...
2. ...
3. ...

## 📝 一句话修改清单
用"动词+量化+结果"格式列出 10 条具体可执行的修改建议。

要求：
1. 完全基于简历内容，不要假设不存在的经历
2. 评分客观，宁缺毋滥
3. 建议具体到可以直接改的程度
4. 语言专业但不晦涩`,
    userPrompt: (text) => `以下是我的完整简历内容，请做全面体检：\n\n${text}`
  },
  skills: {
    title: '💡 技能缺口分析',
    btnText: '分析中...',
    systemPrompt: `你是资深技术面试官。请分析用户的技能栈，输出：

## 🎯 目标岗位匹配度
（假设用户目标是 Java 后端开发，如简历有明确目标以简历为准）

## ✅ 已具备的核心技能（用 ✅ 标记）
## ⚠️ 有但不够深入的技能（用 ⚠️ 标记 + 补强建议）
## ❌ 缺失的高频技能（用 ❌ 标记 + 学习优先级）
## 📚 3 个月补强路线图
按月拆解，每月 3-5 个具体学习项目

## 💼 如果去面大厂，需要立刻补的 Top 5

要求：真实、精准、可落地。`,
    userPrompt: (text) => `这是我的简历，请分析技能缺口：\n\n${text}`
  },
  projects: {
    title: '✨ 项目亮点改写',
    btnText: '改写中...',
    systemPrompt: `你是资深简历优化师 + 大厂面试官。请帮用户改写项目经历，遵循 STAR 原则（情境-任务-行动-结果）+ 量化数据：

对每个项目输出：
## 📌 项目名称（改写后）
- **角色**：XXX（更专业的定位）
- **技术栈**：列出核心技术（用户没写的补全合理项）
- **原始描述**（标注用户原文）
- **改写版本**（STAR + 量化，至少 3 条 bullet）
- **为什么更好**（解释改写逻辑）

改写原则：
1. 动词开头（主导/设计/优化/重构/实现）
2. 必须量化（23% → 57.5%，具体数值）
3. 突出技术决策（选型理由）
4. 体现复杂度（高并发/分布式/亿级数据）
5. 避免"负责""参与"等模糊词汇`,
    userPrompt: (text) => `这是我的项目经历，请帮我改写成大厂简历风格：\n\n${text}`
  },
  quantify: {
    title: '📊 量化指标建议',
    btnText: '分析中...',
    systemPrompt: `你是数据驱动的简历优化专家。请针对用户简历的每一段经历，给出具体的量化建议：

## 🎯 核心原则
没有量化 → 面试官无法衡量你的价值 → 必须改！

## 📋 逐段分析
对每段经历，按以下格式输出：
- **原文**：XXX
- **问题**：哪里没量化
- **建议数值来源**（如果简历里没有，给出合理的估算区间）：
  - 用户量：XX 人（假设：团队规模 × 覆盖比例）
  - 数据量：XX 条/XX GB（假设：日活 × 人均行为数）
  - 性能提升：XX%（假设：常规优化幅度）
  - 成本节省：XX%（假设：引入新技术的效益）
  - 响应时间：XXms（假设：优化前后差异）
- **改写示例**：XXX（带具体数字）

## ⚠️ 禁止虚构！
如果简历完全没有线索，给出合理的估算区间（标注"估算"），不要编一个精准数字。

## 💡 万能公式
"通过 XX 方案，将 XX 指标从 X 提升到 Y，提升 Z%"`,
    userPrompt: (text) => `帮我给简历里的每段经历加量化指标建议：\n\n${text}`
  }
};

async function quickAnalyze(type) {
  const cfg = ANALYZE_CONFIGS[type];
  if (!cfg) return;

  if (!AI.hasRealAPI()) {
    showToast('⚠️ 请先在 ⚙️ AI 设置里接入 DeepSeek 等真实 API', 'error');
    document.querySelector('#navAIStatus, .ai-status-wrap')?.click();
    return;
  }

  const chatArea = document.querySelector('.analysis-right .chat-area');
  if (!chatArea) { showToast('请在简历分析页面使用此功能', 'info'); return; }

  const text = extractResumeText();
  if (text.length < 50) {
    showToast('⚠️ 简历内容太少，先填写简历或上传自己的简历', 'error');
    return;
  }

  // 移除之前的 quick-actions，避免重复点击
  const quickDiv = chatArea.querySelector('.quick-actions');
  if (quickDiv) quickDiv.remove();

  // 构造消息
  const aiMsgDiv = document.createElement('div');
  aiMsgDiv.className = 'chat-message ai-message';
  aiMsgDiv.innerHTML = `
    <div class="message-avatar ai-avatar">AI</div>
    <div class="message-content">
      <div class="message-bubble"><span style="color:#888;font-size:12px;">${cfg.title} · 正在深度分析...▊</span></div>
    </div>`;
  chatArea.appendChild(aiMsgDiv);
  chatArea.scrollTop = chatArea.scrollHeight;

  const bubble = aiMsgDiv.querySelector('.message-bubble');

  // 发送 Toast
  showToast('🤖 AI 正在 ' + cfg.title + '（约 15-30 秒）...', 'info');

  try {
    await AI.chatStream(
      [{ role: 'user', content: cfg.userPrompt(text) }],
      cfg.systemPrompt,
      (chunk) => {
        bubble._raw = (bubble._raw || '') + chunk;
        bubble.innerHTML = formatMarkdown(bubble._raw) + '<span style="animation:blink 0.8s infinite;">▊</span>';
        chatArea.scrollTop = chatArea.scrollHeight;
      }
    );
    // 结束
    bubble.innerHTML = formatMarkdown(bubble._raw || '') + `<div style="margin-top:12px;opacity:0.5;font-size:11px;">— ${cfg.title} 完成 —</div>`;
    showToast('✅ ' + cfg.title + ' 完成！', 'success');
  } catch (err) {
    bubble.innerHTML = '❌ AI 分析失败：' + err.message.substring(0, 60);
    showToast('❌ AI 调用失败', 'error');
  }
}

// Markdown 简化渲染（和 inline script 里共享）
if (typeof formatMarkdown !== 'function') {
  // 如果 index.html inline 没定义（不太可能），这里兜底
}

/* =====================================================
   🔧 面试复盘 AI（增强）
   ===================================================== */
function openReplayAIFromTracking(record) {
  showToast('🤖 正在分析面试问题...', 'info');
  // 复用已有的复盘 AI 逻辑（ai.v3.js 里 ai.chatStream 已绑好）
}

console.log('✅ FREESUME P1 AI 增强已加载 - quickAnalyze ready');

