---
name: alfawali-release-qa
description: Preparar e verificar um release do site estático ALFAWALI, incluindo gates de conteúdo, QA, hospedagem, domínio e rollback; usar quando o usuário pedir testes, publicação ou preparação de lançamento.
---

# Release and QA ALFAWALI

Leia `docs/runbook.md`, `docs/qa.md`, `SECURITY_REVIEW.md` e `docs/producao-site/guia-publicacao.md`. Faça primeiro leitura de `git status`; nunca apague alterações locais do usuário.

- Gate comercial: responsável aprovou contato, catálogo, fotos, cobertura, oferta e políticas; produção não é demo; validação de conteúdo passa.
- Gate técnico: `corepack pnpm verify`, E2E e smoke checks de rotas/links/404, orçamento-para-WhatsApp, imagens, acessibilidade básica, headers, canonical, robots, sitemap, HTTPS e domínio real. Declare exatamente o que não foi executado.
- Site continua estático e sem processamento de pagamento/dados no servidor. Se requisito exigir checkout, formulário persistente, login, CRM ou estoque, parar e estimar arquitetura e privacidade em nova etapa.
- Prévia permanece `noindex` e bloqueada em `robots.txt`; variáveis de produção dependem do domínio final. Não indexar URL de prévia.
- Cloudflare Pages é recomendação atual para este site estático, não autorização para criar conta ou publicar. Antes de mudança externa, exigir pedido explícito do titular e seguir configuração atual do fornecedor.
- Antes de lançamento, registrar commit/versão, URL, aprovador e plano de rollback. Após publicar somente com autorização, fazer smoke test e reportar resultado/risco residual. Rollback: redeploy da versão anterior; não alterar DNS sem avaliar impacto.
