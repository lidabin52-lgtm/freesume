/**
 * FREESUME Content Script
 * 注入到目标页面，提供填充功能
 */

(function() {
  'use strict';
  
  // 监听来自popup的消息
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'PING') {
      sendResponse({ status: 'ok', url: location.href, title: document.title });
    }
  });
  
  // 在页面上添加浮动工具条（当检测到网申表单时）
  window.addEventListener('load', () => {
    setTimeout(() => {
      const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
      if (inputs.length >= 3) {
        injectToolbar();
      }
    }, 2000);
  });
  
  function injectToolbar() {
    if (document.getElementById('freesume-toolbar')) return;
    
    const toolbar = document.createElement('div');
    toolbar.id = 'freesume-toolbar';
    toolbar.innerHTML = `
      <button class="freesume-btn" id="freesumeQuickFill" title="FREESUME 一键填充">
        <span class="freesume-icon">⚡</span>
        <span class="freesume-label">FREESUME 填充</span>
      </button>
    `;
    
    document.body.appendChild(toolbar);
    
    document.getElementById('freesumeQuickFill').addEventListener('click', async () => {
      const result = await chrome.storage.local.get('freesume_resume');
      const resume = result.freesume_resume;
      if (!resume) {
        alert('请先在 FREESUME 插件面板中保存简历信息！');
        return;
      }
      
      const filled = await fillResumeFieldsOnPage(resume);
      showPageToast(`✅ 已填充 ${filled} 个字段`, 'success');
    });
  }
  
  async function fillResumeFieldsOnPage(resume) {
    // 直接调用popup.js中定义的填充逻辑（通过content script执行）
    // 这里简化处理，复用同样的关键词匹配
    const filled = [];
    
    const fieldMatchers = {
      name: ['姓名', '名字', 'name', 'fullname'],
      phone: ['手机', '电话', '手机号', '联系方式', 'phone', 'mobile'],
      email: ['邮箱', 'email', 'mail'],
      gender: ['性别', 'gender'],
      birthday: ['生日', '出生日期', 'birth'],
      city: ['城市', '现居', '所在地', 'city', 'address'],
      school: ['学校', '毕业院校', 'school', 'university'],
      major: ['专业', 'major'],
      education: ['学历', 'education', 'degree'],
      gradYear: ['毕业年份', 'graduation']
    };
    
    const allInputs = document.querySelectorAll('input:not([type="hidden"]):not([type="password"]):not([type="file"]), select, textarea');
    
    allInputs.forEach(input => {
      if (input.disabled) return;
      
      const attrs = `${input.id || ''} ${input.name || ''} ${input.placeholder || ''}`.toLowerCase();
      const parentLabel = (input.closest('label')?.textContent || '').toLowerCase();
      const text = `${attrs} ${parentLabel}`;
      
      for (const [field, keywords] of Object.entries(fieldMatchers)) {
        if (!resume[field] || filled.includes(field)) continue;
        
        const matched = keywords.some(kw => text.includes(kw.toLowerCase()));
        if (matched) {
          if (input.tagName === 'SELECT') {
            const opt = Array.from(input.options).find(o => 
              o.value === resume[field] || o.text.includes(resume[field])
            );
            if (opt) input.value = opt.value;
          } else {
            input.value = resume[field];
          }
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          input.classList.add('freesume-filled');
          filled.push(field);
          break;
        }
      }
    });
    
    return filled.length;
  }
  
  function showPageToast(message, type) {
    let toast = document.getElementById('freesume-page-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'freesume-page-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = 'show ' + type;
    setTimeout(() => toast.className = '', 2500);
  }
})();
