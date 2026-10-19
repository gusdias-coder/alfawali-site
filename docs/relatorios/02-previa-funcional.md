# Etapa 2 — primeira prévia funcional

Data: 18/10/2026, America/Sao_Paulo. Estado: entregue para revisão; publicação comercial bloqueada.

## Implementado
- Página /orcamento/ como destino principal do cabeçalho; componente QuoteForm reutilizado.
- Se o armazenamento for negado, resumo em modal conserva os itens em memória na página corrente, com aviso.
- Rascunho versionado com IDs, quantidades e data; expiração de 30 dias; limite de 30 itens; limpeza explícita.
- Revisão da mensagem, cópia com seleção manual como alternativa e conversa sem texto quando a URL ultrapassa 1.800 caracteres.
- Dados pessoais só em memória; abertura do WhatsApp não limpa a lista e não informa envio concluído.
- Modelo de produtos ampliado: aprovação, embalagem, mínimos/múltiplos, preço, disponibilidade e atualização. Os dados demonstrativos continuam como draft.
- Validação de produção reforçada para esses campos, imagens, categorias e preço fixo vigente.
- Busca por nome, ID, marca e referência; termo limitado a 100 caracteres; termo/ordenação/categoria preservados no link de retorno.
- Quantidades respeitam mínimo e múltiplo; edição inválida mantém valor anterior e mostra aviso.
- Razão social e CNPJ presentes em empresa/rodapé. Canais cadastrais não convertidos automaticamente em contatos de vendas.
- Home explicita produtos e serviços. Removidas origem não comprovada e seção vazia de clientes.
- Paleta aproximada aos tokens do PDF, corpo 16 px, textos de apoio ampliados e ajustes de toque/reflow.
- WhatsApp flutuante removido do orçamento para não cobrir o formulário.

## Arquivos
Dados: src/data/company.ts e products.ts. Regras: src/lib/content.ts e quote.ts. Interface: src/components/QuoteForm.astro, src/layouts/Layout.astro, src/scripts/app.ts, src/styles/global.css; páginas index, empresa, orçamento, privacidade, produtos e detalhe. Testes: tests/content.test.ts, quote.test.ts, e2e/site.spec.ts e playwright.config.ts.

## Verificações
- pnpm verify: aprovado, zero erros/avisos/hints; 16 testes unitários; 34 páginas verificadas.
- pnpm test:e2e: 22 aprovados e 2 omissões deliberadas por projeto (menu móvel não executado no desktop; matriz de cinco larguras não duplicada no projeto móvel).
- Chromium 156.0.8078.4 / Playwright 1.64.1; desktop e emulação iPhone 13 em Chromium. Não equivale a Safari real.
- Capturas de home, catálogo, produto e orçamento em 320/390/768/1024/1440 px: sem overflow horizontal no teste.
- Capturas em output/screenshots; revisão visual amostral de home e orçamento.
- Validação de produção rejeita intencionalmente demo, fotos ausentes e políticas não revisadas.
- O teste de corrupção foi corrigido para injetar corrupção uma única vez: antes regravava JSON inválido em toda navegação, inclusive após recuperação válida. O cenário original de recuperação foi preservado.

## Limites e próximos passos
Esta etapa não conclui o P0. Não há publicação externa, domínio configurado ou envio real de mensagem.

1. Revisar visualmente home, catálogo e produto (390 e 1440 px), conforme página 16 do PDF, antes de expandir a direção visual.
2. Substituir exemplos por SKUs e imagens aprovados; importar CSV com relatório; concluir publicação/retirada de registros e preço exibido nas fichas.
3. Acrescentar filtros nas categorias, tratamento de fotos quebradas e documentos oficiais aplicáveis.
4. Confirmar inclusões, exclusões e cobertura dos serviços e então criar seus detalhes; concluir contato/atendimento e políticas reais.
5. Completar SEO, gate de build direto, CI e hospedagem escolhida, sem pipelines concorrentes.
6. Executar axe, Lighthouse, teclado/leitor de tela, Firefox/Safari e celulares reais, sem alegar WCAG integral.
7. Aceite comercial, domínio/HTTPS, smoke e rollback antes de lançamento.

## Dados ainda necessários
Confirmar se (51) 99100-5271 é o WhatsApp comercial; e-mail monitorado; horários; cidades por produto/serviço; público e preços; primeiros produtos com unidade/embalagem/foto; escopo de cada serviço. O e-mail do cadastro aparenta ser da contabilidade. Endereço cadastral não foi anunciado como loja aberta ao público.

## Integridade
Originais do cadastro e documentos privados ficam fora de public/ e do histórico de código. Nenhum serviço pago, envio automático, CMS, checkout ou integração P1/P2 foi ativado.
