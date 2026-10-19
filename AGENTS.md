# ALFAWALI — instruções para o Codex

Site estático em Astro/TypeScript (pnpm). Especificação de referência: `ALFAWALI_Escopo_Codex_2_Semanas.pdf` (v1.0). Escopo resumido em `docs/scope.md`.

## Regras
- Implemente somente P0, uma fatia verificável por vez. P1/P2 e serviços pagos só com decisão registrada em `docs/decisions.md`.
- Não invente produtos, fotos, preços, cobertura, certificados ou provas sociais. Dado não aprovado fica fora da produção.
- Separe fato, hipótese e pendência. Registre arquivos alterados, testes e bloqueios em cada tarefa.
- Se o ambiente impedir um teste, relate; não declare aprovação. Não afrouxe teste para o CI passar.
- Sem segredos ou documentos privados no build ou no Git. Texto do usuário é sempre texto (nunca HTML).
- Não diga "pedido enviado": o site só prepara a mensagem; o envio é feito pela pessoa no WhatsApp.
- Reaproveite componentes e `src/lib/quote.ts` antes de criar novos. Preserve IDs de produto válidos.

## Ambientes
- Prévia (padrão): `noindex`, `robots` bloqueado, demo permitido.
- Produção: `PUBLISH_ENV=production` + `SITE_URL=https://dominio` + `SITE_BASE=/`. Indexável, e `pnpm validate:content` rejeita demo, CNPJ/e-mail vazios, políticas não revisadas e produto sem foto.

## Comandos
```
corepack pnpm install --frozen-lockfile
corepack pnpm verify                       # check + test + validate:content + build + check-build
PUBLISH_ENV=production corepack pnpm validate:content
corepack pnpm exec playwright install --with-deps chromium
corepack pnpm test:e2e
```

## Onde mexer
Dados: `src/data/company.ts`, `products.ts`, `coverage.ts` · Regras de publicação: `src/lib/content.ts` · Orçamento: `src/lib/quote.ts`, `src/scripts/app.ts` · Rotas: `src/pages/` · Headers: `public/_headers` · Modelos de coleta: `data-templates/`.

## Primeira tarefa
Audite o estado atual, liste divergências do escopo e siga o backlog C01–C10 em `docs/scope.md`.
