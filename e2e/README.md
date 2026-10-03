# Testes E2E (Playwright)

Uma pasta por módulo/página e um arquivo por conjunto de testes. `support/` guarda o que é compartilhado: login, acesso ao banco, criação de partida ao vivo e usuário de teste.

| Pasta            | Página / área                                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `sign-in/`       | `/entrar`, proteção de rotas, sair                                                                                              |
| `platform/`      | trilho de navegação, temporadas, tema, página não encontrada                                                                    |
| `championships/` | `/campeonatos` e `/campeonatos/[id]` (abas, classificação, rodada, artilharia, partidas, novo campeonato)                       |
| `new-match/`     | `/campeonatos/[id]/nova-partida` (página e folha)                                                                               |
| `live/`          | `/ao-vivo/[id]` (cronômetro, gol, assistência, cartões, substituição, atalhos, linha do tempo, sincronização)                   |
| `squads/`        | `/elencos` (times, busca, ficha, curiosidades, novo jogador, leitura sem login)                                                 |
| `history/`       | `/historico`, `/historico/times/[id]`, `/historico/atletas/[id]`                                                                |
| `audit-log/`     | `/registro`                                                                                                                     |
| `users/`         | `/usuarios`                                                                                                                     |
| `api/`           | `/api/cron/fmf-sync` e `/api/partidas/[id]/stream`                                                                              |
| `journeys/`      | jornadas de ponta a ponta que atravessam várias páginas (visitante, dia de jogo, elenco, acesso, temporada, histórico, celular) |

## Como rodar

1. `pnpm db:local`, `pnpm db:migrate`, `pnpm fmf:import` (banco com o histórico da FMF).
2. `pnpm dev` (ou `E2E_BASE_URL` apontando para outro servidor).
3. `pnpm e2e`.

A jornada `journeys/operator-runs-a-match-day` confere que a partida recém-encerrada aparece na aba Partidas. No `next dev` essa leitura às vezes volta do cache antigo mesmo depois do `updateTag` (comportamento só do servidor de desenvolvimento); contra o build de produção (`pnpm build && pnpm start`, ou `E2E_BASE_URL` apontando para ele) ela passa sempre, e é contra o build de produção que o CI roda.

O `globalSetup` cria (ou reativa) o usuário `E2E_USERNAME`/`E2E_PASSWORD`, que por padrão é `Operador E2E` / `senha-e2e-local`. Se o usuário já existir, a senha dele não é alterada. Os testes gravam e apagam dados, por isso só rodam contra um banco local; para um banco remoto, defina `E2E_ALLOW_REMOTE_DATABASE=1`.

Os dados que os testes criam (partidas, campeonatos, jogadores, curiosidades, usuários) são apagados direto no banco ao final. Isso não invalida o cache do Next, então a interface pode continuar mostrando esses dados até o cache expirar.
