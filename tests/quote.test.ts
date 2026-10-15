import test from 'node:test';
import assert from 'node:assert/strict';
import { normalize, sanitizeCart, quoteMessage, whatsappLink, cleanField } from '../src/lib/quote.ts';
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
