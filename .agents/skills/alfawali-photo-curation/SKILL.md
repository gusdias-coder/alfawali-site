---
name: alfawali-photo-curation
description: Preparar e integrar imagens autorizadas de produtos, marca, equipe ou operação da ALFAWALI sem apresentá-las falsamente; usar quando o usuário trouxer fotos ou pedir para trocar imagens.
---

# Photo curation ALFAWALI

Leia o briefing em `docs/producao-site/briefing-do-tio.md` e examine o componente de galeria e dados de produto antes de editar.

- Confirme o que a imagem realmente mostra, origem e autorização de publicação. Preserve os originais; não apague ou sobrescreva fonte. Não use foto de concorrente/fabricante sem permissão/licença clara.
- Não retrate imagem gerada, mockup, banco de imagens ou ilustração como produto, sede, equipe, cliente ou serviço real. Se for ilustração, identifique-a como ilustrativa.
- Não altere visualmente rótulo, cor, volume, marca, composição, certificação ou características do produto. Melhorias permitidas: corte, enquadramento, luz moderada, formato responsivo e compressão sem perda relevante.
- Integrar somente itens aprovados em `public/images/produtos/` usando nomes estáveis, dimensões adequadas e `alt` conciso que descreva conteúdo real (alt vazio apenas para decoração).
- Gerar versão web otimizada, sem dados EXIF/localização desnecessários; não deixar originais sensíveis ou arquivos excessivos no build. Verificar caminhos, fallback e dimensão em telas móveis.
- Reportar imagens sem direito de uso, ilegíveis, duplicadas ou que não correspondam à ficha do produto; não adivinhar correspondência.
