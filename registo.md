# Registo do Reporta

## Diagnóstico inicial

**(a)** Se os dois pontos estiverem até 15 m um do outro e o buraco ainda estiver por resolver, a comunicação da Ana cria a ocorrência e a do Bruno reforça-a. Fica uma ocorrência com duas comunicações. Se for a Ana a voltar a comunicá-la com o mesmo identificador, o servidor devolve `ja-comunicada` e o contador mantém-se.

**(b)** Com uma precisão de 60 m, duas medições do mesmo buraco podem cair a mais de 15 m uma da outra e originar duas ocorrências. Também pode acontecer o inverso: dois buracos diferentes podem aparecer no GPS perto o suficiente para serem tratados como o mesmo. A interface deve mostrar os 60 m e avisar que a precisão é pior do que o raio de 15 m. Com ligação, deve pedir ao cidadão que ajuste o ponto no mapa. Sem ligação, a comunicação segue para a fila local com a precisão medida.

**(c)** Quando receber a confirmação de que a comunicação foi juntada à ocorrência 87, o dispositivo guarda em `minhas` a associação do `idLocal` ao `ocorrenciaId: 87`, atualiza a ocorrência 87 com os dados devolvidos e retira o registo de `pendentes`. Estas três alterações ficam na mesma transação. A interface passa a mostrar «Juntada à n.º 87».

**(d)** Sem rede, a página nem chega a consultar as semelhantes. Com rede, duas pessoas podem consultar quase ao mesmo tempo, antes de qualquer uma enviar a comunicação, e ambas obter uma lista vazia. Quando cada pedido chega, o servidor volta a procurar entre as ocorrências que existem nesse momento.

## 4.1 · Pedidos e estratégia

| Pedido | `Cache-Control` | Quem o faz | Funciona sem rede? | Pode ser repetido sem efeitos adicionais? |
| --- | --- | --- | --- | --- |
| `GET /v1/categorias` | `public, max-age=86400` | Service worker, para atualizar `meta` | A página usa as categorias já guardadas em `meta`. A atualização pede ligação. | Sim |
| `GET /v1/ocorrencias/semelhantes` | `no-store` | Página, antes de guardar a comunicação | Exige ligação. Sem rede, a comunicação fica pendente. | Sim |
| `GET /v1/ocorrencias?bbox=` | `no-store` | Página, ao consultar o mapa | Exige ligação para consultar a área. | Sim |
| `POST /v1/ocorrencias` sem `Idempotency-Key` | `no-store` | Service worker, ao enviar a fila | O envio aguarda ligação. | Sem garantia. Cada tentativa é tratada como um novo pedido. |
| `POST /v1/ocorrencias` com `Idempotency-Key` | `no-store` | Service worker, ao enviar a fila | O envio aguarda ligação. | Sim, com o mesmo cidadão, chave e corpo durante 24 h. |
| `POST /v1/ocorrencias/{id}/reforcos` com `Idempotency-Key` | `no-store` | Service worker, ao enviar a fila | O envio aguarda ligação. | Sim, com o mesmo cidadão, chave e corpo durante 24 h. |
| `GET /v1/ocorrencias/alteracoes` | `no-store` | Service worker, depois de enviar a fila | Exige ligação para receber alterações novas. | Sim, incluindo com o mesmo cursor. |


### Antes de avançar

**Identidade.** Sem OAuth, os dois `POST` e o pedido de alterações levam `X-Cidadao`, com o UUID que o dispositivo guarda em `meta`. Com OAuth, o browser envia o cookie de sessão `HttpOnly` e o servidor associa a sessão à conta do cidadão. O `PATCH` de administração usa `X-Admin-Token`.

**Candidatas.** A consulta de semelhantes vai sempre à rede. Uma resposta antiga pode omitir uma ocorrência entretanto criada ou mostrar uma ocorrência já resolvida. Guardamos na Cache API os ficheiros da interface, ficando as respostas de `/v1/` fora dessa cache.

## Arranque local

No PowerShell, a partir da raiz do repositório:

```powershell
cd servidor
if (-not (Test-Path .env)) { Copy-Item .env.exemplo .env }
npm.cmd install
node --env-file=.env servidor.js
```
