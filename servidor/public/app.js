const estadoApp = document.querySelector('#estado-app');

if ('serviceWorker' in navigator) {
  try {
    await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;
    estadoApp.textContent = 'Service worker ativo.';
  } catch (erro) {
    estadoApp.textContent = 'Falha no registo do service worker.';
    console.error(erro);
  }
} else {
  estadoApp.textContent = 'O registo requer um browser compatível em HTTPS ou localhost.';
}
