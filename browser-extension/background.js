/**
 * FREESUME 插件 - Background Service Worker
 */

// 安装时初始化
chrome.runtime.onInstalled.addListener((details) => {
  console.log('FREESUME Extension installed:', details.reason);
  
  // 设置默认简历模板
  chrome.storage.local.get('freesume_resume', (result) => {
    if (!result.freesume_resume) {
      chrome.storage.local.set({
        freesume_resume: {
          name: '',
          phone: '',
          email: '',
          gender: '男',
          birthday: '',
          city: '',
          school: '',
          major: '',
          education: '本科',
          gradYear: ''
        }
      });
    }
  });
});

// 处理来自content script的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_RESUME') {
    chrome.storage.local.get('freesume_resume', (result) => {
      sendResponse(result.freesume_resume || {});
    });
    return true; // 异步
  }
});

// 标签页更新时检查是否是网申页面
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // 可以在这里注入content script或发送消息
  }
});
