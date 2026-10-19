# Runbook
Um único caminho de deploy por vez. O workflow atual (`.github/workflows/deploy.yml`) publica prévia no GitHub Pages; a proposta do escopo é Cloudflare Pages para produção.
## Produção (Cloudflare Pages, após os gates do escopo)
1. Variáveis de build: `PUBLISH_ENV=production`, `SITE_URL=https://dominio`, `SITE_BASE=/`. Comando: `pnpm verify`. Saída: `dist`.
2. Conferir em produção: home, produto, orçamento, contato, 404, robots, sitemap, HTTPS, headers e número do WhatsApp.
3. Marcar o commit com tag de release.
## Rollback
Reimplantar o deploy anterior no painel (ou reverter a tag/commit). Depois, verificar DNS, número de contato e arquivos.
## Rotina
48 h: contato e erros · semanal: links e produtos retirados · mensal: dependências, quotas e catálogo.
