const express = require('express');
const path = require('node:path');

const app = express();
const porta = Number(process.env.PORT || 3000);

function responderNaoImplementado(_pedido, resposta) {
  resposta.set('Cache-Control', 'no-store').status(501).json({
    codigo: 'NAO_IMPLEMENTADO',
    mensagem: 'Esta operação ainda está em preparação.',
  });
}

app.get('/v1/categorias', responderNaoImplementado);
app.get('/v1/ocorrencias/semelhantes', responderNaoImplementado);
app.get('/v1/ocorrencias', responderNaoImplementado);
app.post('/v1/ocorrencias', responderNaoImplementado);
app.post('/v1/ocorrencias/:id/reforcos', responderNaoImplementado);
app.get('/v1/ocorrencias/:id/fotografia', responderNaoImplementado);
app.get('/v1/ocorrencias/alteracoes', responderNaoImplementado);
app.patch('/v1/admin/ocorrencias/:id', responderNaoImplementado);

app.use(express.static(path.join(__dirname, 'public')));

app.use((_pedido, resposta) => {
  resposta.set('Cache-Control', 'no-store').status(404).json({
    codigo: 'ROTA_INEXISTENTE',
    mensagem: 'A rota pedida não existe.',
  });
});

const servidor = app.listen(porta, '127.0.0.1', () => {
  console.log(`Reporta disponível em http://localhost:${servidor.address().port}/`);
});
