# Evidências de QA
Registrar commit, ambiente, navegador, caso, esperado, observado. Nada abaixo foi executado em navegador ainda.
| ID | Cenário | Estado |
|---|---|---|
| Q01–Q12 | Matriz do escopo (menu, busca, filtros, galeria, quantidade, persistência, mensagem, cobertura, 404/deploy) | não executado |
| — | `pnpm verify` (tipos, unitários, validação de conteúdo, build, links, CSP) | executado na criação da base: passou em modo prévia |
| — | `PUBLISH_ENV=production pnpm validate:content` | falha de propósito: dados demo e campos vazios |
