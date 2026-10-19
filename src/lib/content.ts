// Regras de publicação (RF02, RF03). Função pura: usada pelo script de validação e pelos testes.
export interface ContentIssue { scope: string; message: string }
interface ProductLike { id: string; name?: string; category: string; description?: string; unit?: string; demo?: boolean; images?: unknown[] }
interface CompanyLike { demo?: boolean; cnpj?: string; email?: string; whatsapp?: string; policiesReviewed?: boolean }
export const MAX_PRODUCTS = 30;

export function validateContent(input: { company: CompanyLike; categories: readonly { id: string }[]; products: readonly ProductLike[]; strict: boolean }): ContentIssue[] {
  const { company, categories, products, strict } = input;
  const issues: ContentIssue[] = [];
  const add = (scope: string, message: string) => issues.push({ scope, message });
  const categoryIds = new Set(categories.map(c => c.id));
  const seen = new Set<string>();
  for (const p of products) {
    if (seen.has(p.id)) add(p.id, 'ID duplicado.');
    seen.add(p.id);
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
    if (p.demo) add(p.id, 'Produto de demonstração não pode ir para produção.');
    if (!p.images?.length) add(p.id, 'Ao menos 1 foto real é obrigatória.');
  }
  return issues;
}
