# Do código ao site no ar — roteiro para ALFAWALI

## Resposta curta: o que precisa pagar?

- **Hospedagem:** para o site atual (estático, sem backend), Cloudflare Pages pode servir os arquivos estáticos sem custo no plano Free; os pedidos estáticos são gratuitos e ilimitados segundo a documentação atual. A conta, limites e preços podem mudar; confira antes de contratar. Se no futuro adicionar funções/backend, quotas e cobrança são diferentes.
- **Domínio próprio:** opcional para testar, recomendado para marca. Registro.br informa atualmente R$ 40 por ano para domínio `.br`; confirme preço/disponibilidade no momento da compra. Registre no nome/conta controlados pela empresa.
- **E-mail profissional:** só terá custo se for contratado; não é exigido para o site compilar, mas o endereço comercial precisa ser monitorado antes de exibi-lo.
- **Google Search Console e perfil local elegível:** sem custo para criar/gerenciar; anúncios pagos são opcionais e só com teto autorizado.
- **Pagamento online, CMS, CRM, backend e estoque:** não fazem parte do projeto atual e podem trazer custos técnicos/operacionais. Não contratar até definir requisitos.

Fontes oficiais consultadas em 18/10/2026: [Registro.br — domínio a R$ 40/ano](https://registro.br/dominio); [Cloudflare — assets estáticos gratuitos e ilimitados](https://developers.cloudflare.com/pages/functions/pricing/); [Cloudflare — limites do Pages Free](https://developers.cloudflare.com/pages/platform/limits/); [Search Console](https://search.google.com/search-console/about). Confirmar novamente antes da decisão, pois preços/limites mudam.

## Etapa 0 — proteger o que já existe

1. Não mover nem sobrescrever `alfawali-site`; há alterações locais não commitadas. Faça cópia de segurança/versionamento antes de qualquer mudança grande.
2. Não publicar os documentos do briefing, planilhas, PDFs, fotos sem autorização ou dados pessoais. Só arquivos do site necessários vão para `public/`.
3. Decidir com o titular quem controla GitHub, domínio, hospedagem e e-mail. Criar convites para usuários individuais; nunca mandar senha no chat.

## Etapa 1 — preparar o computador (Windows/PowerShell)

Abra terminal na pasta do projeto: `C:\Users\Gustavo Dias\OneDrive\Documentos\ChatGPT\Site Wanderlei\alfawali-site`.

Requisitos: Node.js `>=22.22.0` (README sugere Node 24) e Corepack/pnpm `11.25.0` via `packageManager` do projeto. Instalação reproduzível:

```powershell
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

Abra `http://127.0.0.1:4321/` para ver localmente. Use servidor Astro; abrir o HTML direto/Live Server quebra rotas. Para parar, `Ctrl+C`.

## Etapa 2 — preencher e aprovar dados reais

1. O responsável preenche `briefing-do-tio.md`, `data-templates/produtos.csv` e `data-templates/cobertura.csv`.
2. Confirmar especialmente o WhatsApp atual `(51) 99100-5271`, e-mail comercial, região, horário, regra de preço/orçamento e dados legais já presentes.
3. Trocar os 16 exemplos ilustrativos por produtos reais aprovados; começar por 8–15 que a empresa quer vender. Preservar IDs válidos quando um produto já tiver URL.
4. Receber fotos reais/autorizadas. Copiar versões otimizadas para `public/images/produtos/`, manter originais fora de `public/` e do Git se contiverem informação privada. Cada foto precisa de descrição alt fiel e licença/consentimento documentado.
5. Validar escopo dos 3 serviços, cidades, disponibilidade, inclusões/exclusões, entrega, validade e responsável por aprovar.
6. Revisar termos e privacidade com o responsável. Somente então tirar `demo` e marcar política revisada, após confirmar o código do validador e o fluxo exato.

## Etapa 3 — QA antes de produção

No projeto, rode:

```powershell
corepack pnpm verify
corepack pnpm test:e2e
```

O primeiro verifica tipos, testes, dados, build e integridade de saída. E2E verifica interações. Se houver erro, não publicar; corrigir a causa sem desabilitar testes. O pipeline pode não incluir todos os itens: revisar manualmente teclado/foco, acessibilidade, textos, URLs e imagens. Confirmar em celular real/mais de um navegador se possível. `pnpm verify` deve passar depois que os dados de produção forem completos; hoje alguns bloqueios são intencionais.

## Etapa 4 — preparar domínio e Cloudflare Pages (recomendado, ainda não configurado)

Cloudflare Pages é uma proposta para o site estático; esta etapa requer o titular aprovar e criar/conectar as contas. Não reutilizar o deploy GitHub Pages da demonstração como site comercial: GitHub declara que Pages não é destinado a hospedar gratuitamente um negócio online/transações comerciais.

1. Colocar o código em repositório Git controlado pela empresa ou por Gustavo com aprovação; proteger branch principal e manter cópia do código.
2. Comprar/registrar domínio pelo titular (ex.: `.com.br`, se disponível) e guardar renovação/2FA. Confirmar nome e direitos de marca antes de pagar.
3. No Cloudflare: Workers & Pages → Create application → Pages → conectar o repositório Git.
4. **Root directory:** raiz do repositório Astro (se o repositório for exatamente `alfawali-site`, deixe vazio/raiz). **Build output:** `dist`. **Build command:** usar o gate do projeto `pnpm verify` quando estiver pronto; se o pipeline de deploy estiver separado do QA, executar `pnpm verify` obrigatório antes e então o build de produção. Configurar o gerenciador/Node para cumprir `pnpm-lock.yaml`, Node `>=22.22.0` e `pnpm@11.25.0` (verificar logs da primeira build).
5. Variáveis de build **Production** segundo `docs/runbook.md`: `PUBLISH_ENV=production`, `SITE_URL=https://SEU-DOMINIO`, `SITE_BASE=/`. Não copiar essas variáveis para preview: preview deve permanecer não indexável.
6. Primeiro usar URL temporária de Pages para smoke test; confirmar build, páginas, links, WhatsApp, formulário/resumo e 404 antes de configurar DNS definitivo.
7. Adicionar domínio customizado no painel do Pages e seguir exatamente os registros DNS oferecidos pelo Cloudflare/registrador. Não adivinhar A/CNAME; não remover registros de e-mail existentes. Configurar HTTPS, redirecionamento preferido (www ou raiz) e canonical coerentes.
8. Validar `https://SEU-DOMINIO/`, `/robots.txt`, `/sitemap.xml`, HTTPS, 404, celular e contato; confirmar que preview não é indexado e produção está indexável. Guardar URL e data da versão implantada.

Configuração de build deve ser conferida nos [docs do Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/build-configuration/) e [Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/); a documentação orienta comando de build, diretório de saída e diretório raiz. A versão do painel pode mudar.

## Etapa 5 — Google e descoberta orgânica

1. Verificar titularidade do domínio no Google Search Console usando método recomendado ao responsável.
2. Enviar `https://SEU-DOMINIO/sitemap.xml`; o sitemap não garante indexação, mas ajuda a descoberta/monitoramento.
3. Verificar relatório de páginas/indexação e desempenho depois do crawl; corrigir páginas demonstrativas/duplicadas/404.
4. Criar ou reivindicar perfil no Google Business Profile apenas se elegível e usando conta da empresa; não publicar endereço onde não há atendimento presencial permitido.
5. Não comprar anúncio ainda. Primeiro obter linha de base, confirmar conversão de contato e definir orçamento, região, criativos, medição e limite de parada.

## Etapa 6 — checklist de lançamento/rollback

- [ ] Dono da empresa aprovou dados, políticas, conteúdo e imagens.
- [ ] `pnpm verify` e E2E aprovados; pendências de QA documentadas.
- [ ] Domínio está no nome/controle da empresa; DNS e renovação registrados.
- [ ] HTTPS/canonical/robots/sitemap revisados no domínio real.
- [ ] WhatsApp e e-mail foram testados por uma pessoa; nenhuma página promete envio concluído.
- [ ] Produtos/serviços, categorias, fotos, preços/“sob consulta”, cobertura e condições refletem a realidade.
- [ ] 404, links, responsividade, acessibilidade básica e fluxo de orçamento verificados.
- [ ] Uma pessoa sabe reimplantar a versão anterior; commit/tag e horário do deploy anotados.
- [ ] Revisão 24–48h após publicar: contato recebido, erros, DNS, caminhos e formulário/WhatsApp.

## Depois de publicar: manutenção leve

Semanal no primeiro mês: testar contato e páginas principais. Mensal: conferir produtos descontinuados/preços/horários, Search Console, dependências e backups. Cada mudança deve passar por prévia e `pnpm verify`; publicar apenas após aprovação. Se mudar o escopo para pagamento, CRM, dados armazenados ou contas de cliente, parar e estimar arquitetura, privacidade, segurança e custo como nova etapa.
