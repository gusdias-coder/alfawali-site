# Evidências de QA
Registrar commit, ambiente, navegador, caso, esperado, observado. Nada abaixo foi executado em navegador ainda.
| ID | Cenário | Estado |
|---|---|---|
| Q01–Q12 | Matriz do escopo (menu, busca, filtros, galeria, quantidade, persistência, mensagem, cobertura, 404/deploy) | não executado |
| — | `pnpm verify` (tipos, unitários, validação de conteúdo, build, links, CSP) | executado na criação da base: passou em modo prévia |
| — | `PUBLISH_ENV=production pnpm validate:content` | falha de propósito: dados demo e campos vazios |

## Execução de 18/10/2026

Ver `relatorios/02-previa-funcional.md`: 16 unitários e 22 testes Playwright aprovados, 2 omitidos por projeto. Matriz visual de 5 larguras executada. Não representa aprovação de Q01–Q12 completa; faltam validação comercial, navegadores reais, ferramentas de a11y/performance e produção. Base Git effca8f; alterações locais ainda não commitadas.
