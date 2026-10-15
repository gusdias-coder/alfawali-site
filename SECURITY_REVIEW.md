# Revisão de segurança — apresentação ALFAWALI

## Escopo e medidas implementadas

- **Segredos:** site estático, sem chaves de API ou credenciais. `.env`, propostas, PDFs e temporários fora do versionamento. O telefone comercial é público por solicitação do responsável pelo projeto.
- **XSS:** formulários e lista construídos com `textContent`/`createElement`; sem `innerHTML`, `eval` ou HTML recebido de usuários. Dados digitados são apresentados como texto e codificados com `encodeURIComponent` no link do WhatsApp.
- **Lista adulterada:** IDs limitados ao catálogo; quantidades inteiras de 1 a 999; dados corrompidos descartados; testes com entradas inválidas.
- **CSP:** HTML de produção restringe scripts, estilos, fontes e conexões à própria origem; bloqueia objetos e submissão de formulários. Scripts e estilos externos ao HTML, sem `unsafe-inline`.
- **Privacidade:** dados de formulários ficam somente na memória da página; apenas IDs/quantidades ficam no armazenamento local. Links externos usam `noopener noreferrer`. Sem analytics, chatbot ou pixels.
- **Envio:** usuário revisa mensagem antes de clicar para abrir WhatsApp. Não há confirmação de compra ou preço. Preços, pagamentos e entrega dependem da equipe comercial.
- **Autenticação, autorização e SQL/NoSQL:** não aplicáveis nesta versão: não existe backend, conta, sessão, API de escrita nem banco de dados. Não simular painel administrativo com senha no JavaScript.
- **Prompt injection:** não existe IA no site. Um eventual chatbot exige projeto e revisão próprios; um prompt isolado não garante proteção.
- **Dependências:** versões e lockfile versionados; revisar auditoria e atualizações periodicamente.

## Limites

Revisão de código e testes funcionais não equivalem a teste de invasão nem certificação de segurança. GitHub Pages não permite configurar todos os cabeçalhos HTTP (por exemplo `frame-ancestors` precisa de cabeçalho e não funciona em meta CSP). Na hospedagem de produção, adicionar política anti-enquadramento, cabeçalhos adequados e monitoramento. Ausência de achados não garante ausência de vulnerabilidades.

Não armazenar senhas, pagamentos ou documentos sensíveis neste site. Manter o modo demonstrativo até concluir a validação comercial e de privacidade. A classificação de confiabilidade de sites de terceiros não foi parte desta implementação.
