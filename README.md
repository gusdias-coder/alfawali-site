# ALFAWALI — apresentação Premium

Site estático demonstrativo em português, com cinco páginas principais, catálogo com oito linhas, busca, filtros e lista de cotação com quantidades. O usuário revisa os dados antes de abrir o WhatsApp **(51) 99100-5271**. Não há envio automático.

## Tecnologias

- Astro 7, TypeScript e CSS responsivo; HTML estático, sem React ou backend.
- Fonte Manrope hospedada junto com o site; imagens da marca fornecidas pelo cliente e ilustrações SVG próprias.
- localStorage apenas para IDs e quantidades da lista, nunca para dados pessoais dos formulários.
- GitHub Actions para validação e publicação da apresentação no GitHub Pages.
- Node 24, pnpm 11, testes unitários nativos e Playwright para testes de interface.

## Desenvolvimento

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm verify
pnpm test:e2e
```

Para testes de interface, instale Chromium com `pnpm exec playwright install chromium`.
Para simular o endereço do repositório, configure `GITHUB_REPOSITORY=gusdias-coder/alfawali-site` antes de `pnpm verify` e `pnpm preview`.

## Publicação

Em Settings → Pages, selecione GitHub Actions. A publicação ocorre após alterações em main. O endereço desta apresentação é https://gusdias-coder.github.io/alfawali-site/.

GitHub Pages é usado **somente como demonstração para aprovação**. Antes de operação comercial real, migrar para hospedagem adequada aos termos de uso, definir domínio e revisar privacidade, dados e conteúdos. Consulte os [limites do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

## Editar os conteúdos

- `src/data/company.ts`: empresa, telefone, categorias, serviços e logos autorizados de clientes.
- `src/data/products.ts`: produtos. Há **16 exemplos ilustrativos**, não um estoque real. O escopo inicial permite cadastrar até 30 itens, após recebimento dos materiais.
- Cada produto tem sua página em `produtos/<id>/`, com descrição completa, ficha técnica, galeria de miniaturas, ampliação e quantidade para cotação. Foto e título no catálogo também abrem os detalhes.
- `public/images/`: logo e aplicação de marca. A imagem da placa é uma aplicação visual, não uma fotografia comprovada de sede.
- `src/pages/`: textos e estrutura das páginas.
- `src/styles/global.css`: identidade visual e responsividade.

Não foram inventados CNPJ, endereço, e-mail, preços, marcas de clientes, certificações ou depoimentos. Não há checkout, cobrança, login, painel administrativo, banco de dados, chatbot ou integrações de estoque. Catálogo PDF completo é solicitado ao atendimento; o site não promete um arquivo inexistente.

Domínio, e-mails profissionais e hospedagem comercial precisam ser contratados/configurados separadamente. Propostas, documentos comerciais e arquivos temporários locais não fazem parte do repositório.

## Cadastrar os detalhes reais

Em `src/data/products.ts`, mantenha o `id` do produto para preservar links e cotações salvas. Adicione os campos opcionais no objeto existente:

```ts
fullDescription: [
  'Descrição completa aprovada pelo fornecedor.',
  'Informações adicionais de uso e conservação aprovadas.',
],
specifications: {
  brand: 'Marca confirmada',
  reference: 'Código do fabricante',
  dimensions: 'Medidas com unidade',
  weight: 'Peso com unidade',
  capacity: 'Volume ou capacidade com unidade',
  material: 'Material ou composição',
  color: 'Cor confirmada',
  packaging: 'Apresentação / quantidade por embalagem',
  additional: [{ label: 'Outra característica', value: 'Valor confirmado' }],
},
images: [
  { src: 'images/produtos/codigo-frente.webp', alt: 'Nome do produto visto de frente' },
  { src: 'images/produtos/codigo-embalagem.webp', alt: 'Embalagem e rótulo do produto' },
],
```

As fotos devem existir em `public/images/produtos/` (o caminho em `src` não começa com `public/`). A primeira aparece no catálogo; todas aparecem na galeria. Use fotos autorizadas e textos alternativos descritivos. Não preencha uma característica desconhecida: campos ausentes exibem “A confirmar”. Sem fotos cadastradas, a galeria usa uma ilustração com duas visualizações identificadas como demonstração. Troque `demo` apenas após validar o cadastro; o site inteiro continua sendo uma apresentação até sua aprovação de produção.

## Antes de lançar para clientes reais

1. Aprovar textos, contato, região e serviços com os sócios.
2. Trocar os exemplos por produtos reais com fotos, unidades e descrições aprovadas.
3. Receber autorização para logos de clientes e conteúdo da marca.
4. Configurar domínio, hospedagem de produção e e-mails contratados.
5. Revisar política de privacidade e responsabilidades; remover os avisos de demonstração somente após essa revisão.
6. Revalidar segurança, links, acessibilidade e fluxo do WhatsApp.

Veja `SECURITY_REVIEW.md` para o escopo da revisão técnica. A marca e os materiais da ALFAWALI pertencem aos respectivos titulares; a publicação não concede licença de reutilização.
