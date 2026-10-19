export interface QuoteProduct { id: string; name: string; unit: string; demo: boolean; packaging?: string; minimum?: number; multiple?: number; status?: string }
export interface QuoteLine { id: string; quantity: number }
export const MAX_QUANTITY = 999;
export const MAX_ITEMS = 30;
export const QUOTE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const MAX_WHATSAPP_URL = 1800;

export function restoreQuote(raw: string | null, allowedIds: readonly string[], now = Date.now()): QuoteLine[] {
  if (!raw) return [];
  try {
    const draft = JSON.parse(raw);
    if (!draft || draft.version !== 1 || typeof draft.updatedAt !== 'string' || !Array.isArray(draft.items)) return [];
    const timestamp = Date.parse(draft.updatedAt);
    if (!Number.isFinite(timestamp) || timestamp > now || now - timestamp >= QUOTE_TTL_MS) return [];
    return sanitizeCart(draft.items.map((item: unknown) => {
      if (!item || typeof item !== 'object') return null;
      const line = item as Record<string, unknown>;
      return { id: line.productId, quantity: line.quantity };
    }), allowedIds);
  } catch { return []; }
}
export function serializeQuote(lines: QuoteLine[], allowedIds: readonly string[], now = Date.now()): string {
  return JSON.stringify({ version: 1, updatedAt: new Date(now).toISOString(), items: sanitizeCart(lines, allowedIds).map(line => ({ productId: line.id, quantity: line.quantity })) });
}
export function messageDestination(phone: string, message: string) {
  const url = whatsappLink(phone, message);
  return { url: url.length <= MAX_WHATSAPP_URL ? url : `https://wa.me/${phone}`, copyRequired: url.length > MAX_WHATSAPP_URL };
}

export function validQuantity(quantity: number, product: { minimum?: number; multiple?: number }): boolean {
  return Number.isInteger(quantity) && quantity >= (product.minimum ?? 1) && quantity <= MAX_QUANTITY && quantity % (product.multiple ?? 1) === 0;
}
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
  return [...lines].slice(0, MAX_ITEMS).map(([id, quantity]) => ({ id, quantity }));
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
  for (const line of safe) { const product = products.find(p => p.id === line.id)!; if (product.status === 'retired' || !validQuantity(line.quantity, product)) throw new Error(`Revise a quantidade de ${product.name}.`); }
  const name = cleanField(customer.name, 80);
  const city = cleanField(customer.city, 80);
  if (name.length < 2 || city.length < 2) throw new Error('Informe seu nome e sua cidade.');
  const parts = [demo ? '[DEMONSTRAÇÃO DO SITE ALFAWALI — NÃO É UM PEDIDO]' : 'Olá, ALFAWALI! Gostaria de solicitar uma cotação.', '', `Nome: ${name}`, `Empresa: ${cleanField(customer.company, 120) || 'Não informada'}`, `Cidade: ${city}`, '', 'Itens selecionados:'];
  for (const line of safe) {
    const p = products.find(p => p.id === line.id)!;
    parts.push(`• ${p.name} (${p.id}) — ${line.quantity} ${p.unit}(s)${p.packaging ? ` — ${p.packaging}` : ''}${p.demo ? ' [exemplo]' : ''}`);
  }
  const notes = cleanField(customer.notes || '', 1000);
  if (notes) parts.push('', `Observações: ${notes}`);
  parts.push('', demo ? 'Lista gerada para apresentação. Produtos e disponibilidade ainda serão confirmados.' : 'Por favor, informe disponibilidade, preços e condições de entrega no RS.');
  return parts.join('\n');
}
