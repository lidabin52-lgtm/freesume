/**
 * FREESUME 插件 - 弹出面板逻辑
 */

// 表单字段映射
const FIELD_MAP = {
  'r_name': 'name',
  'r_phone': 'phone',
  'r_email': 'email',
  'r_gender': 'gender',
  'r_birthday': 'birthday',
  'r_city': 'city',
  'r_school': 'school',
  'r_major': 'major',
  'r_education': 'education',
  'r_gradYear': 'gradYear'
};

// 页面状态检测
const JOB_SITES = [
  { domain: 'bytedance.com', name: '字节跳动', keyword: ['resume', '简历', 'apply', 'application'] },
  { domain: 'alibaba.com', name: '阿里巴巴', keyword: ['resume', '简历', 'apply'] },
  { domain: 'tencent.com', name: '腾讯', keyword: ['resume', '简历', 'apply'] },
  { domain: 'meituan.com', name: '美团', keyword: ['resume', '简历', 'apply'] },
  { domain: 'xiaomi.com', name: '小米', keyword: ['resume', '简历', 'apply'] },
  { domain: 'baidu.com', name: '百度', keyword: ['resume', '简历', 'apply'] },
  { domain: 'xhslink.com', name: '小红书', keyword: ['resume', '简历', 'apply'] },
  { domain: 'huawei.com', name: '华为', keyword: ['resume', '简历', 'apply'] },
  { domain: 'liepin.com', name: '猎聘', keyword: ['resume', '简历'] },
  { domain: 'zhipin.com', name: 'BOSS直聘', keyword: ['resume', '简历'] },
  { domain: '51job.com', name: '前程无忧', keyword: ['resume', '简历'] }
];

document.addEventListener('DOMContentLoaded', async () => {
  // 加载已保存的信息
  await loadSavedData();
  
  // 检测当前页面
  await detectPage();
  
  // 保存按钮
  document.getElementById('saveBtn').addEventListener('click', saveResume);
  
  // 清空按钮
  document.getElementById('clearBtn').addEventListener('click', clearResume);
  
  // 填充按钮
  document.getElementById('fillBtn').addEventListener('click', doFill);
  
  // 导入按钮
  document.getElementById('loadFromWeb').addEventListener('click', () => {
    // 简单提示，实际可以通过chrome.runtime.connect
    showToast('请先在 FREESUME 网站导出简历数据，然后粘贴到插件中', 'info');
  });
});

async function loadSavedData() {
  const result = await chrome.storage.local.get('freesume_resume');
  const resume = result.freesume_resume;
  if (resume) {
    Object.entries(FIELD_MAP).forEach(([fieldId, key]) => {
      const el = document.getElementById(fieldId);
      if (el && resume[key]) el.value = resume[key];
    });
    document.getElementById('fillBtn').disabled = false;
  }
}

async function saveResume() {
  const resume = {};
  Object.entries(FIELD_MAP).forEach(([fieldId, key]) => {
    resume[key] = document.getElementById(fieldId)?.value?.trim() || '';
  });
  
  await chrome.storage.local.set({ freesume_resume: resume });
  document.getElementById('fillBtn').disabled = false;
  showToast('✅ 简历信息已保存', 'success');
}

async function clearResume() {
  if (!confirm('确定要清空所有简历信息吗？')) return;
  await chrome.storage.local.remove('freesume_resume');
  Object.values(FIELD_MAP).forEach((_, fieldId) => {
    document.getElementById(fieldId) && (document.getElementById(fieldId).value = '');
  });
  document.getElementById('fillBtn').disabled = true;
  showToast('已清空', 'info');
}

async function detectPage() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url) {
    setPageStatus('❌ 无法检测', false);
    return;
  }
  
  const url = tab.url.toLowerCase();
  const matched = JOB_SITES.find(site => url.includes(site.domain));
  
  if (matched) {
    setPageStatus(`✅ ${matched.name} 网申页面`, true);
  } else if (url.includes('http')) {
    setPageStatus('📄 普通网页（通用填充）', true);
  } else {
    setPageStatus('❌ 非网页', false);
  }
}

function setPageStatus(text, active) {
  const badge = document.getElementById('pageStatus');
  badge.textContent = text;
  badge.classList.toggle('active', active);
}

async function doFill() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    showToast('无法访问当前标签页', 'error');
    return;
  }
  
  // 获取简历数据
  const result = await chrome.storage.local.get('freesume_resume');
  const resume = result.freesume_resume;
  if (!resume) {
    showToast('请先保存简历信息', 'error');
    return;
  }
  
  // 发送填充消息到content script
  try {
    showToast('⚡ 正在自动填充...', 'info');
    
    // 使用scripting API执行填充
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: fillResumeFields,
      args: [resume]
    });
    
  } catch (err) {
    console.error('Fill error:', err);
    showToast('填充失败：' + err.message, 'error');
  }
}

// 填充函数（会被注入到目标页面执行）
function fillResumeFields(resume) {
  const filled = [];
  
  // 智能匹配字段的关键词映射
  const fieldMatchers = {
    name: ['姓名', '名字', 'name', 'fullname', 'full name', 'realname'],
    phone: ['手机', '电话', '手机号', '联系方式', 'phone', 'mobile', 'tel'],
    email: ['邮箱', 'email', 'mail', 'e-mail'],
    gender: ['性别', 'gender', 'sex'],
    birthday: ['生日', '出生日期', 'birth', 'birthday', 'date of birth'],
    city: ['城市', '现居', '所在地', '地址', 'city', 'address', 'location'],
    school: ['学校', '毕业院校', '院校', 'school', 'university', 'college'],
    major: ['专业', 'major', 'specialty'],
    education: ['学历', 'education', 'degree', '最高学历'],
    gradYear: ['毕业年份', '毕业时间', 'graduation', 'grad year']
  };
  
  // 遍历所有输入框、选择框
  const allInputs = document.querySelectorAll('input, select, textarea');
  
  allInputs.forEach(input => {
    if (input.disabled || input.type === 'hidden' || input.type === 'file' || input.type === 'password') return;
    
    const inputId = (input.id || '').toLowerCase();
    const inputName = (input.name || '').toLowerCase();
    const inputPlaceholder = (input.placeholder || '').toLowerCase();
    const parentLabel = findParentLabel(input);
    const allText = `${inputId} ${inputName} ${inputPlaceholder} ${parentLabel}`.toLowerCase();
    
    // 尝试匹配每个字段
    for (const [field, keywords] of Object.entries(fieldMatchers)) {
      if (!resume[field]) continue;
      if (filled.includes(field)) continue;
      
      const matched = keywords.some(kw => allText.includes(kw.toLowerCase()));
      if (matched) {
        setFieldValue(input, resume[field], field);
        filled.push(field);
        break;
      }
    }
  });
  
  // 也尝试查找label里的文字
  document.querySelectorAll('label').forEach(label => {
    const labelText = label.textContent.toLowerCase().trim();
    const input = label.querySelector('input, select, textarea') || 
                  document.getElementById(label.getAttribute('for'));
    
    if (!input || filled.some(f => fieldMatchers[f]?.some(kw => labelText.includes(kw.toLowerCase())))) return;
    
    for (const [field, keywords] of Object.entries(fieldMatchers)) {
      if (!resume[field] || filled.includes(field)) continue;
      if (keywords.some(kw => labelText.includes(kw.toLowerCase()))) {
        setFieldValue(input, resume[field], field);
        filled.push(field);
        break;
      }
    }
  });
  
  return { filled: filled.length, total: Object.keys(resume).filter(k => resume[k]).length };
}

function setFieldValue(input, value, field) {
  try {
    if (input.tagName === 'SELECT') {
      // 下拉框：尝试精确匹配或包含匹配
      const options = Array.from(input.options);
      const matched = options.find(opt => 
        opt.value === value || 
        opt.text.includes(value) || 
        value.includes(opt.text)
      );
      if (matched) {
        input.value = matched.value;
        triggerChange(input);
      }
    } else {
      // 输入框
      input.focus();
      input.value = value;
      triggerChange(input);
      // 触发react/vue等框架的事件
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, 'value'
      )?.set || Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype, 'value'
      )?.set;
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
    input.classList.add('freesume-filled');
  } catch (e) {
    console.warn('Fill field error:', e);
  }
}

function triggerChange(input) {
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  input.dispatchEvent(new Event('blur', { bubbles: true }));
}

function findParentLabel(input) {
  let el = input;
  for (let i = 0; i < 5; i++) {
    el = el.parentElement;
    if (!el) break;
    const label = el.querySelector('label') || (el.tagName === 'LABEL' ? el : null);
    if (label) return label.textContent.toLowerCase();
  }
  return '';
}

// Toast 提示
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}
