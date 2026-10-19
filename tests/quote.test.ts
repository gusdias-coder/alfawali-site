import test from 'node:test';
import assert from 'node:assert/strict';
import { validQuantity, restoreQuote, serializeQuote, messageDestination, QUOTE_TTL_MS, normalize, sanitizeCart, quoteMessage, whatsappLink, cleanField } from '../src/lib/quote.ts';
const products = [{ id: 'coffee-01', name: 'Café', unit: 'pacote', demo: true }];
test('busca ignora acentos e caixa', () => assert.equal(normalize(' CAFÉ '), 'cafe'));
test('dados corrompidos e ids desconhecidos são descartados', () => {
  for (const bad of [null, {}, '[]', 123]) assert.deepEqual(sanitizeCart(bad, ['coffee-01']), []);
  assert.deepEqual(sanitizeCart([{ id:'x', quantity:1 }, { id:'coffee-01', quantity:Infinity }, { id:'coffee-01', quantity:-1 }], ['coffee-01']), []);
});
test('quantidade inteira limitada e ids sem duplicação', () => {
  assert.deepEqual(sanitizeCart([{ id:'coffee-01', quantity:1.8 }], ['coffee-01']), [{id:'coffee-01',quantity:1}]);
  assert.deepEqual(sanitizeCart([{ id:'coffee-01', quantity:2 },{id:'coffee-01',quantity:99999}], ['coffee-01']), [{id:'coffee-01',quantity:999}]);
});
test('mensagem exige itens, nome e cidade', () => {
  const person = {name:'Teste',city:'Porto Alegre',company:''};
  assert.throws(() => quoteMessage([],products,person));
  assert.throws(() => quoteMessage([{id:'coffee-01',quantity:1}],products,{...person,name:'  '}));
});
test('WhatsApp correto, mensagem demonstrativa, quantidade e campos preservados', () => {
  const message = quoteMessage([{id:'coffee-01',quantity:3}],products,{name:'Teste',city:'Porto Alegre',company:'Empresa',notes:'Sem envio real'});
  assert.match(message,/DEMONSTRAÇÃO/); assert.match(message,/3 pacote/);
  const url = new URL(whatsappLink('5551991005271',message));
  assert.equal(url.hostname,'wa.me'); assert.equal(url.pathname,'/5551991005271'); assert.equal(url.searchParams.get('text'),message);
});
test('texto especial é codificado, nunca interpretado como URL', () => {
  const input = '<img src=x onerror=alert(1)> & #?';
  const url = new URL(whatsappLink('5551991005271',input));
  assert.equal(url.searchParams.get('text'), input); assert.equal(url.hash,'');
  assert.throws(() => whatsappLink('javascript:alert(1)',input));
});
test('campos têm limite e sem caracteres de controle', () => {
  assert.equal(cleanField(' a\n\u0000 b '),'a b'); assert.equal(cleanField('x'.repeat(500),100).length,100);
});

test('rascunho versionado expira em 30 dias e rejeita datas futuras e JSON corrompido', () => {
  const now = Date.parse('2026-10-18T12:00:00Z');
  const lines = [{ id: 'coffee-01', quantity: 2 }];
  const raw = serializeQuote(lines, ['coffee-01'], now);
  assert.deepEqual(restoreQuote(raw, ['coffee-01'], now + 1), lines);
  assert.deepEqual(restoreQuote(raw, ['coffee-01'], now + QUOTE_TTL_MS), []);
  assert.deepEqual(restoreQuote(raw, ['coffee-01'], now - 1), []);
  assert.deepEqual(restoreQuote(raw, [], now), []);
  for (const raw of ['invalid', 'null', '[]', '{"version":2}', '{"version":1,"items":[null]}']) assert.deepEqual(restoreQuote(raw, ['coffee-01'], now), []);
});
test('persistência contém somente versão, data, IDs e quantidades; limite de 30 itens', () => {
  const lines = Array.from({length: 35}, (_, i) => ({id: `p${i}`, quantity: 1}));
  const data = JSON.parse(serializeQuote(lines, lines.map(p => p.id)));
  assert.equal(data.items.length, 30);
  assert.deepEqual(Object.keys(data).sort(), ['items', 'updatedAt', 'version']);
  assert.deepEqual(Object.keys(data.items[0]).sort(), ['productId', 'quantity']);
});
test('URL longa oferece conversa sem texto; URL curta preserva mensagem exata', () => {
  assert.deepEqual(messageDestination('5551991005271', 'á'.repeat(600)), {url: 'https://wa.me/5551991005271', copyRequired: true});
  const result = messageDestination('5551991005271', 'Olá');
  assert.equal(result.copyRequired, false);
  assert.equal(new URL(result.url).searchParams.get('text'), 'Olá');
});

test('mínimos e múltiplos comerciais são respeitados', () => {
  for (const quantity of [0,1,3,7,1000,6.5,NaN]) assert.equal(validQuantity(quantity,{minimum:6,multiple:3}),false);
  assert.equal(validQuantity(6,{minimum:6,multiple:3}),true);
  assert.equal(validQuantity(999,{minimum:6,multiple:3}),true);
});
