export interface QuoteProduct { id: string; name: string; unit: string; demo: boolean }
export interface QuoteLine { id: string; quantity: number }
export const MAX_QUANTITY = 999;

export function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim();
}

export function sanitizeCart(value: unknown, allowedIds: readonly string[]): QuoteLine[] {
  if (!Array.isArray(value)) return [];
  const allowed = new Set(allowedIds);
  const lines = new Map<string, number>();
  for (const entry of value.slice(0, 100)) {
    if (!entry || typeof entry !== 'object') continue;
    const { id, quantity } = entry as Record<string, unknown>;
    if (typeof id !== 'string' || !allowed.has(id) || typeof quantity !== 'number' || !Number.isFinite(quantity)) continue;
    if (quantity < 1) continue;
    lines.set(id, Math.min(MAX_QUANTITY, Math.floor(quantity)));
  }
  return [...lines].map(([id, quantity]) => ({ id, quantity }));
}

export function cleanField(value: string, max = 100): string {
  return value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

export function whatsappLink(phone: string, message: string): string {
  if (!/^\d{10,15}$/.test(phone)) throw new Error('Número de atendimento inválido.');
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function quoteMessage(lines: QuoteLine[], products: readonly QuoteProduct[], customer: { name: string; company: string; city: string; notes?: string }, demo = true): string {
  const safe = sanitizeCart(lines, products.map(p => p.id));
  if (!safe.length) throw new Error('Adicione um produto à lista.');
  const name = cleanField(customer.name);
  const city = cleanField(customer.city);
  if (!name || !city) throw new Error('Informe seu nome e sua cidade.');
  const parts = [demo ? '[DEMONSTRAÇÃO DO SITE ALFAWALI — NÃO É UM PEDIDO]' : 'Olá, ALFAWALI! Gostaria de solicitar uma cotação.', '', `Nome: ${name}`, `Empresa: ${cleanField(customer.company) || 'Não informada'}`, `Cidade: ${city}`, '', 'Itens selecionados:'];
  for (const line of safe) {
    const p = products.find(p => p.id === line.id)!;
    parts.push(`• ${p.name} — ${line.quantity} ${p.unit}(s)${p.demo ? ' [exemplo]' : ''}`);
  }
  const notes = cleanField(customer.notes || '', 400);
  if (notes) parts.push('', `Observações: ${notes}`);
  parts.push('', demo ? 'Lista gerada para apresentação. Produtos e disponibilidade ainda serão confirmados.' : 'Por favor, informe disponibilidade, preços e condições de entrega no RS.');
  return parts.join('\n');
}
