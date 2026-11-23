self.addEventListener('install', (evento) => {
  evento.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(self.clients.claim());
});
