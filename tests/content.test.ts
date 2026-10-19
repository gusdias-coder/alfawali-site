import test from 'node:test';
import assert from 'node:assert/strict';
import { validateContent } from '../src/lib/content.ts';

const categories = [{ id: 'papeis' }];
const company = { demo: false, cnpj: '00.000.000/0001-00', email: 'a@b.com.br', whatsapp: '5551999999999', policiesReviewed: true };
const ok = { id: 'p1', name: 'Produto teste', status: 'approved', packaging: 'Pacote com 100 unidades', minimum: 1, multiple: 1, pricePolicy: 'quote', availabilityText: 'A confirmar', updatedAt: '2026-10-18', category: 'papeis', unit: 'pacote', description: 'x', demo: false, images: [{src:'images/produto.webp',alt:'Produto teste'}] };

test('conteúdo completo passa em produção', () => {
  assert.deepEqual(validateContent({ company, categories, products: [ok], strict: true }), []);
});
test('prévia aceita demonstração; produção rejeita', () => {
  const demo = { ...ok, demo: true, images: [] };
  assert.equal(validateContent({ company: { ...company, demo: true }, categories, products: [demo], strict: false }).length, 0);
  assert.ok(validateContent({ company: { ...company, demo: true }, categories, products: [demo], strict: true }).length >= 3);
});
test('ID duplicado e categoria inexistente falham sempre', () => {
  const issues = validateContent({ company, categories, products: [ok, { ...ok, category: 'x' }], strict: false });
  assert.ok(issues.some(i => i.message.includes('duplicado')) && issues.some(i => i.message.includes('Categoria')));
});
test('empresa sem CNPJ, e-mail ou políticas revisadas falha em produção', () => {
  const issues = validateContent({ company: { ...company, cnpj: '', email: '', policiesReviewed: false }, categories, products: [ok], strict: true });
  assert.equal(issues.length, 3);
});

test('publicação rejeita rascunho, embalagem ausente, múltiplo inválido e preço vencido', () => {
  for (const patch of [{status:'draft'}, {packaging:''}, {minimum:3,multiple:2}, {pricePolicy:'fixed',priceCents:100,priceValidUntil:'2020-01-01'}, {images:[{src:'javascript:alert(1)',alt:''}]}]) {
    assert.ok(validateContent({company,categories,products:[{...ok,...patch}],strict:true}).length > 0);
  }
});
