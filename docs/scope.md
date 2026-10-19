# Escopo P0 (resumo) — janela 19 a 30/10/2026

Limites: até 30 produtos, 8 categorias, 3 serviços. P1 e P2 ficam fora (formulário por e-mail, CMS, login, checkout, ERP).

## Rotas P0
| ID | Rota | Estado na base |
|---|---|---|
| T01 | `/` | front-end concluído; hero tipográfico, categorias e destaques demo |
| T02 | `/produtos/` | busca, filtros, ordenação, estado vazio e parâmetros de URL implementados |
| T03 | `/produtos/categoria/[slug]/` | concluída para as 8 categorias com produto |
| T04 | `/produtos/[id]/` | ficha, galeria, unidade/embalagem/mín./múltiplo e cotação implementados |
| T05/T06 | `/servicos/` (+ detalhe `[slug]`) | índice + 3 detalhes, processo, perguntas frequentes e consulta contextual |
| T07 | `/orcamento/` | página completa; modal apenas como contingência sem armazenamento |
| T08 | `/contato/` | existe; falta e-mail/horário reais |
| T09 | `/atendimento/` | **criada**; lê `src/data/coverage.ts` (vazio → "consulte a disponibilidade") |
| T10 | `/empresa/` | existe; conteúdo a validar |
| T11 | `/privacidade/` | existe; texto precisa de revisão |
| T12 | `/condicoes/` | **criada** (rascunho, aviso até `policiesReviewed=true`) |
| T13 | `404.html` | existe |

## Pronto na base
Validação de publicação (RF02/RF03), ambiente prévia × produção, robots e sitemap por ambiente, canonical, `_headers` (CSP com `frame-ancestors`), matriz de cobertura tipada, modelos CSV de coleta, testes de conteúdo.

## Backlog
C01 auditar repo · C02 schema completo do produto (unidade, embalagem, mín., múltiplo, preço, status) · C03 tokens e modelos visuais (home, catálogo, produto em 390/1440 px) · C04 busca/filtros/URLs · C05 ficha e galeria · C06 serviços `[slug]`, empresa, políticas · C07 página `/orcamento/` completa (limite 30 itens, 1.800 caracteres, expiração 30 dias) · C08 SEO/headers/CI para Cloudflare · C09 QA · C10 release e rollback.

## Bloqueadores de publicação (dependem do tio)
CNPJ, e-mail, política B2B/B2C e de preço, produtos reais com foto, cobertura, políticas revisadas.

## Fechamento do front-end — 19/10/2026

Estrutura de interface concluída em Astro/TypeScript, com Sistema/Claro/Escuro. A próxima etapa de conteúdo aguarda os detalhes e imagens reais dos produtos. Conteúdo demonstrativo, oferta não confirmada e dados ainda em revisão permanecem sinalizados; isso não impede revisar a interface local. Publicação comercial continua uma etapa separada.

Evidências: `pnpm verify` (16 testes, 37 páginas e metadados únicos), `pnpm test:e2e` (32 aprovados, 4 omissões por projeto), matriz completa de 37 rotas × 3 larguras × 2 temas. Ver `docs/relatorios/03-frontend-final.md`. C08/C10 referentes a hospedagem/release não foram executados nesta etapa local.
