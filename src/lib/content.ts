// Regras de publicação (RF02, RF03). Função pura: usada pelo script de validação e pelos testes.
export interface ContentIssue { scope: string; message: string }
interface ProductLike { id: string; name?: string; category: string; description?: string; unit?: string; demo?: boolean; images?: {src?: string; alt?: string}[]; status?: string; packaging?: string; minimum?: number; multiple?: number; pricePolicy?: string; priceCents?: number; priceValidUntil?: string; availabilityText?: string; updatedAt?: string }
interface CompanyLike { demo?: boolean; cnpj?: string; email?: string; whatsapp?: string; policiesReviewed?: boolean }
export const MAX_PRODUCTS = 30;

export function validateContent(input: { company: CompanyLike; categories: readonly { id: string }[]; products: readonly ProductLike[]; strict: boolean }): ContentIssue[] {
  const { company, categories, products, strict } = input;
  const issues: ContentIssue[] = [];
  const add = (scope: string, message: string) => issues.push({ scope, message });
  const categoryIds = new Set(categories.map(c => c.id));
  if (categories.length > 8) add('categories', 'Limite de 8 categorias no P0.');
  if (categoryIds.size !== categories.length) add('categories', 'Categoria duplicada.');
  const seen = new Set<string>();
  for (const p of products) {
    if (seen.has(p.id)) add(p.id, 'ID duplicado.');
    seen.add(p.id);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.id)) add(p.id, 'ID inválido para rota.');
    if (!p.name?.trim()) add(p.id, 'Nome obrigatório.');
    if (!categoryIds.has(p.category)) add(p.id, `Categoria inexistente: ${p.category}.`);
    if (!p.unit?.trim()) add(p.id, 'Unidade obrigatória.');
    if (!p.description?.trim()) add(p.id, 'Descrição obrigatória.');
  }
  if (!/^\d{10,15}$/.test(company.whatsapp || '')) add('company', 'WhatsApp inválido (somente dígitos, com DDI).');
  if (!strict) return issues;
  if (company.demo) add('company', 'company.demo=true não pode ir para produção.');
  if (!company.cnpj?.trim()) add('company', 'CNPJ obrigatório.');
  if (!company.email?.trim()) add('company', 'E-mail de contato obrigatório.');
  if (!company.policiesReviewed) add('company', 'Privacidade e condições ainda não foram revisadas (policiesReviewed=false).');
  if (products.length > MAX_PRODUCTS) add('catalog', `Limite de ${MAX_PRODUCTS} produtos no P0.`);
  for (const p of products) {
    if (p.status !== 'approved') add(p.id, 'Status approved obrigatório em produção.');
    if (!p.packaging?.trim()) add(p.id, 'Embalagem obrigatória.');
    if (!Number.isInteger(p.minimum) || p.minimum! < 1 || p.minimum! > 999) add(p.id, 'Mínimo inválido.');
    if (!Number.isInteger(p.multiple) || p.multiple! < 1 || p.multiple! > 999 || p.minimum! % p.multiple! !== 0) add(p.id, 'Múltiplo inválido ou incompatível com mínimo.');
    if (!p.availabilityText?.trim()) add(p.id, 'Política de disponibilidade obrigatória.');
    if (!p.updatedAt || !Number.isFinite(Date.parse(p.updatedAt))) add(p.id, 'Data de atualização obrigatória.');
    if (!['quote', 'fixed'].includes(p.pricePolicy || '')) add(p.id, 'Política de preço obrigatória.');
    if (p.pricePolicy === 'fixed' && (!Number.isSafeInteger(p.priceCents) || p.priceCents! <= 0 || !p.priceValidUntil || !Number.isFinite(Date.parse(p.priceValidUntil)) || Date.parse(p.priceValidUntil + 'T23:59:59-03:00') < Date.now())) add(p.id, 'Preço fixo exige centavos positivos e validade vigente.');
    if (p.images?.some(image => !image.src?.startsWith('images/') || !image.alt?.trim() || image.src.includes('..'))) add(p.id, 'Imagem deve ter caminho local e texto alternativo.');
    if (p.images && p.images.length > 4) add(p.id, 'Máximo de 4 imagens.');
    if (p.demo) add(p.id, 'Produto de demonstração não pode ir para produção.');
    if (!p.images?.length) add(p.id, 'Ao menos 1 foto real é obrigatória.');
  }
  return issues;
}
