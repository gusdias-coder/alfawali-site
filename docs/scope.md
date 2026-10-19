# Escopo P0 (resumo) — janela 19 a 30/10/2026

Limites: até 30 produtos, 8 categorias, 3 serviços. P1 e P2 ficam fora (formulário por e-mail, CMS, login, checkout, ERP).

## Rotas P0
| ID | Rota | Estado na base |
|---|---|---|
| T01 | `/` | existe; copy a revisar (demo) |
| T02 | `/produtos/` | existe; busca/filtros no cliente; URL com `?categoria=` |
| T03 | `/produtos/categoria/[slug]/` | **criada** (só categorias com produto) |
| T04 | `/produtos/[id]/` | existe; falta unidade/embalagem/mín./múltiplo do schema |
| T05/T06 | `/servicos/` (+ detalhe `[slug]`) | índice existe; **detalhe pendente** |
| T07 | `/orcamento/` | **criada como casca**; fluxo ainda usa o modal (C07) |
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
