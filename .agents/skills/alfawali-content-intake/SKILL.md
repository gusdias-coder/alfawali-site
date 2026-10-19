---
name: alfawali-content-intake
description: Coletar, validar e aplicar informações comerciais aprovadas da ALFAWALI em conteúdo e catálogo; usar quando o usuário fornecer respostas, CSVs ou documentos de conteúdo.
---

# Content intake ALFAWALI

Leia `docs/producao-site/briefing-do-tio.md`, `docs/content-checklist.md` e os modelos CSV antes de transformar material em conteúdo.

- Diferencie fato aprovado, dado presente que ainda precisa confirmação e campo pendente. A razão social/CNPJ já aparecem no código; o telefone está configurado, mas precisa confirmação como canal comercial. Não peça documentos novamente sem motivo.
- Não infira estoque, preço, marca, especificação, disponibilidade, cobertura, certificação ou promessa a partir de nome ou CNAE.
- Valide unidade/embalagem, mínimo/múltiplo e preço conforme o schema atual. Mantenha IDs válidos de produtos existentes para não quebrar URLs e cotações.
- Produtos sem aprovação/foto/dados suficientes continuam fora da produção. Não remova o gate de `validate-content` nem troque `demo`/`policiesReviewed` como atalho.
- Se CSV tiver ambiguidades, crie uma lista curta de dúvidas para o responsável em vez de adivinhar. Não publicar dados pessoais ou documentos em `public/`/Git.
- Faça a menor alteração necessária e rode os testes de conteúdo relevantes. Documente fonte, aprovador e data quando esses campos existirem.
