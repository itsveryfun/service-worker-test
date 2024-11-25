self.addEventListener('install', (event) => {
  console.log('Service Worker 安装完成');
  self.skipWaiting(); // 安装后立即激活
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker 激活');
  event.waitUntil(clients.claim()); // 立即接管控制页面
});

self.addEventListener('fetch', (event) => {
  console.log('拦截到请求:', event.request.url);

  // 获取请求头信息
  let headersInfo = '';
  for (let [key, value] of event.request.headers.entries()) {
    headersInfo += `${key}: ${value}\n`;
  }

  // 将请求头信息发送到主页面
  event.waitUntil(
    self.clients.matchAll().then((clients) => {
      if (clients && clients.length) {
        clients[0].postMessage(headersInfo); // 发送到第一个客户端
      }
    })
  );

  // 继续正常响应请求
  event.respondWith(fetch(event.request));
});