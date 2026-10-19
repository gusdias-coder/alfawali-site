# Produção Site — ALFAWALI

Pasta de trabalho para levar a prévia atual a um site comercial real, com fatos aprovados, imagens autorizadas, SEO básico e publicação verificável.

## Onde está cada coisa

- Código do site: raiz de `alfawali-site/` (`src/`, `public/`, `tests/`).
- Dados: `src/data/company.ts`, `src/data/products.ts`, `src/data/coverage.ts`.
- Modelos para preenchimento: `data-templates/produtos.csv` e `data-templates/cobertura.csv`.
- Plano e diagnóstico já existentes: `docs/scope.md`, `docs/runbook.md`, `docs/RELATORIO.md` e `docs/relatorios/`.
- Skills reutilizáveis pelo Codex: `.agents/skills/`.
- Nesta pasta: briefing para o Wanderlei, prompt mestre, plano de marketing/SEO e guia de publicação.

## Situação real hoje

**A base visual e funcional existe, mas não está pronta para venda/publicação comercial.** O Astro gera um site estático, tem catálogo demonstrativo, páginas da empresa/serviços/contato/orçamento, busca e preparação de uma mensagem para WhatsApp. Não há checkout, pagamento, backend, login, painel, estoque sincronizado ou envio automático. Não anunciar essas funções.

Já há razão social e CNPJ no código e um número de WhatsApp configurado; ambos ainda precisam de confirmação do responsável, sobretudo o número como canal de vendas. Há logo e aplicação visual da marca, mas não um conjunto de fotos reais dos produtos. Os dados de produto atuais são exemplos. E-mail comercial, horários, endereço de atendimento, catálogo real, cobertura, condições e revisão das políticas ainda precisam de confirmação.

O endereço atual no GitHub Pages está identificado como demonstração. Não usar GitHub Pages como hospedagem gratuita do site de uma operação comercial; o próprio GitHub informa essa limitação em [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits). Recomendação inicial para esta arquitetura estática: Cloudflare Pages + domínio próprio, condicionada a testes e confirmação do titular da conta.

## Ordem de trabalho

1. Seu tio preenche `briefing-do-tio.md` e confirma os pontos já presentes; envia os CSVs e imagens autorizadas.
2. Gustavo revisa marca, páginas e fotos com o titular; pendências e decisões ficam registradas, sem inventar conteúdo.
3. Codex substitui dados demonstrativos, implementa apenas o escopo aprovado e roda os testes.
4. Responsável da empresa aprova conteúdo, preços/condições, privacidade e canal comercial.
5. Configurar domínio/hospedagem seguindo `guia-publicacao.md`; fazer publicação controlada, smoke test e manter rollback.
6. Depois do lançamento: perfil local se elegível, Search Console, conteúdo útil e acompanhamento mensal segundo `marketing-seo.md`.

## Skills do projeto

As skills não dão acesso automático a contas externas nem substituem autorização humana. São procedimentos locais para o Codex trabalhar com foco:

| Skill | Papel / quando usar |
|---|---|
| `alfawali-project-router` | Coordenar uma tarefa e escolher a skill especializada sem carregar todas. |
| `alfawali-content-intake` | Conferir informações recebidas, organizar CSV, identificar lacunas e atualizar conteúdo aprovado. |
| `alfawali-photo-curation` | Preparar fotos reais autorizadas, nomes, formatos, alt text e galerias sem fingir que imagem gerada é foto do produto. |
| `alfawali-seo-local` | SEO técnico/on-page/local, pesquisa de termos e medição sem promessa de ranking. |
| `alfawali-marketing-growth` | Oferta, marca, canais, calendário editorial, captação e métricas com orçamento controlado. |
| `alfawali-release-qa` | Testes, revisão de lançamento, configuração e rollback; não publica sem solicitação explícita. |

## Critério de “pronto”

Não basta compilar. O responsável confirma contato, conteúdo, catálogo, cobertura, fotos e políticas; o pipeline de conteúdo de produção passa; rotas e fluxo de orçamento são verificados; HTTPS, domínio, robots/sitemap e dados de contato estão corretos; é feito smoke test após o deploy; há forma testada de retornar à versão anterior. Veja também `guia-publicacao.md`.
