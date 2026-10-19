# Etapa 3 — acabamento do front-end Astro

19/10/2026. Escopo: implementação local solicitada por Gustavo; sem publicação nesta etapa.

## Entrega

Hero tipográfico com proposta direta, entradas para categorias e CTAs de produtos/orçamento. Cabeçalho compacto e rodapé com contato e identificação. Catálogo, categorias, ficha, galeria, cotação, contato, serviços, empresa, cobertura, políticas e 404 compartilham a mesma direção visual. Preservados IDs, URLs, regras, demonstrações e revisão da mensagem antes do WhatsApp.

Tokens em `src/styles/tokens.css`; componentes e responsividade em `global.css`. Vermelho e azul-marinho, fonte Manrope local, superfícies sem efeitos decorativos. Imagens e SVGs existentes não recebem filtros. Sem fotos reais adequadas no material local consultado, o hero usa tipografia e links úteis.

Seletor Sistema/Claro/Escuro no rodapé. Sistema é o padrão e acompanha mudanças do dispositivo. Escolhas manuais persistem quando permitido; armazenamento negado não impede a troca na página. `public/theme-init.js` aplica a preferência no head antes da primeira pintura, com script externo autorizado pela CSP. Preferência também descrita na página de privacidade.

Controles dependentes de JavaScript só aparecem após a inicialização. Sem scripts, navegação, categorias e conteúdo permanecem disponíveis. Menu móvel fecha com Escape e devolve foco; adição à cotação tem feedback discreto; movimento reduzido remove transições.

## Verificações

- `pnpm verify`: **0 errors, 0 warnings, 0 hints**; **16 testes aprovados**; **37 páginas** com links, recursos locais, H1, títulos/descrições únicos, identificação Schema.org e CSP verificados.
- `pnpm test:e2e`: **32 passed, 4 skipped**. O menu móvel é omitido no projeto desktop; as matrizes de larguras e contraste são omitidas no projeto mobile por já rodarem no desktop. Sem testes enfraquecidos.
- Chromium automatizado: busca, categorias, ordenação, estado vazio, galeria, quantidade inválida, persistência, revisão da mensagem, armazenamento negado, temas, menu/Escape e navegação sem JavaScript.
- Matriz completa de 37 páginas × 390/768/1440 px × claro/escuro: H1 visível e sem overflow horizontal. Matriz anterior em cinco larguras preservada. Capturas locais em `output/screenshots/final-*.png`; inspeção visual das capturas de celular, tablet, desktop e serviços.
- Contraste dos tokens: texto, texto secundário, links, ações, avisos e erros ≥4,5:1; bordas dos campos e foco ≥3:1 nos pares testados. Movimento reduzido verificado. Corrigida a largura intrínseca da faixa de filtros que alargava o catálogo móvel.
- `PUBLISH_ENV=production pnpm validate:content`: **exit 1**, esperado; dados demonstrativos, fotos e aprovações pendentes continuam bloqueando produção.
- `git diff --check`: sem erros de whitespace.

Limites: Chromium emulado e capturas; sem inspeção interativa pelo navegador do app, pois nenhuma superfície estava disponível. Sem leitor de tela, dispositivos físicos, Firefox/Safari, Lighthouse ou métricas de campo. A revisão focalizada não declara conformidade WCAG integral.

## Arquivos e pendências

Alterados: layout compartilhado, CSS, home, componentes de produto/galeria/CTA, páginas de catálogo/categoria/produto, empresa, cobertura, políticas, script principal e teste existente do menu. Novos: tokens, inicialização/seletor de tema e testes dos comportamentos novos.

Skills aplicadas: design-critique direcionou a hierarquia para catálogo e retirou o mockup protagonista; design-system organizou tokens/temas; accessibility-review orientou foco/contraste/teclado; engineering:debug isolou a falha de largura dos filtros. Sem novas dependências.

Prévia: `pnpm preview` ou `pnpm dev` em `alfawali-site`, http://127.0.0.1:4321/. Material real ainda necessário: catálogo/SKUs, fotos autorizadas, contato e horários, cobertura, escopo de serviços e políticas aprovadas. Esta etapa não realizou commit, push, deploy ou alterações de DNS.

## Auditoria de fechamento

Concluídas as três páginas de detalhes dos serviços, com escopo, região sob consulta, processo, FAQ nativa acessível sem JavaScript e CTA que identifica o assunto no formulário. Os escopos de limpeza e apoio ficam explicitamente sujeitos à confirmação; não foram convertidos em promessa de oferta ativa. O teste novo verifica navegação ao detalhe, abertura da FAQ por teclado e mensagem revisável com o serviço selecionado. A FAQ também foi testada sem JavaScript.

Cada página tem descrição própria. A identificação estruturada Organization usa somente nome, razão social e CNPJ existentes; não declara loja física ou cobertura. A ficha técnica passa a usar a embalagem do produto e seus campos de mínimo/múltiplo, mantendo os valores de exemplo sinalizados como pendentes.

O front-end está encerrado para esta etapa. A próxima alteração de catálogo aguarda detalhes e imagens dos produtos. Confirmações comerciais e legais continuam condições de lançamento, não funcionalidades adicionais pendentes de implementação.
