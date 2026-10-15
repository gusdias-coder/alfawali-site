import { company, categories } from '../data/company';
import { products } from '../data/products';
import { sanitizeCart, normalize, MAX_QUANTITY, quoteMessage, whatsappLink, cleanField, type QuoteLine } from '../lib/quote';

const query = <T extends Element = HTMLElement>(selector: string) => document.querySelector<T>(selector);
const all = <T extends Element = HTMLElement>(selector: string) => [...document.querySelectorAll<T>(selector)];
const storageKey = `alfawali:quote:v1:${import.meta.env.BASE_URL}`;
const ids = products.map(p => p.id);
let cart: QuoteLine[] = [];
let storageAvailable = true;
try { cart = sanitizeCart(JSON.parse(localStorage.getItem(storageKey) || '[]'), ids); } catch { storageAvailable = false; }
const dialog = query<HTMLDialogElement>('#quote-dialog')!;
let previousFocus: HTMLElement | null = null;
let toastTimer: ReturnType<typeof setTimeout>;

function toast(message: string) {
  const el = query('[data-toast]')!;
  el.textContent = message;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.hidden = true, 3500);
}

function invalidateMessage() {
  query('[data-message-review]')!.hidden = true;
  query<HTMLAnchorElement>('[data-message-link]')!.removeAttribute('href');
  query('[data-message-text]')!.textContent = '';
  query<HTMLFormElement>('#quote-form')!.hidden = cart.length === 0;
}

function updateCart(next: QuoteLine[]) {
  cart = sanitizeCart(next, ids);
  try { localStorage.setItem(storageKey, JSON.stringify(cart)); } catch { storageAvailable = false; }
  invalidateMessage();
  renderCart();
}

function element<K extends keyof HTMLElementTagNameMap>(tag: K, cls = '', text = '') {
  const el = document.createElement(tag);
  el.className = cls;
  el.textContent = text;
  return el;
}

function renderCart() {
  all('[data-cart-count]').forEach(el => el.textContent = String(cart.length));
  const list = query('[data-quote-items]')!;
  list.replaceChildren();
  for (const line of cart) {
    const product = products.find(p => p.id === line.id)!;
    const row = element('div', 'quote-item');
    const detail = element('div');
    detail.append(element('h3', '', product.name), element('p', '', `${product.unit}${product.demo ? ' • exemplo ilustrativo' : ''}`));
    const controls = element('div', 'quantity-controls');
    const minus = element('button', '', '−');
    minus.type = 'button'; minus.setAttribute('aria-label', `Diminuir quantidade de ${product.name}`);
    minus.disabled = line.quantity <= 1;
    const input = element('input');
    input.type = 'number'; input.min = '1'; input.max = String(MAX_QUANTITY); input.step = '1'; input.inputMode = 'numeric';
    input.value = String(line.quantity); input.setAttribute('aria-label', `Quantidade de ${product.name}`);
    const plus = element('button', '', '+');
    plus.type = 'button'; plus.setAttribute('aria-label', `Aumentar quantidade de ${product.name}`);
    plus.disabled = line.quantity >= MAX_QUANTITY;
    const change = (amount: number, restoreLabel?: string) => {
      const quantity = Number.isFinite(amount) ? Math.max(1, Math.min(MAX_QUANTITY, Math.floor(amount))) : 1;
      updateCart(cart.map(item => item.id === line.id ? { ...item, quantity } : item));
      if (restoreLabel) all<HTMLButtonElement | HTMLInputElement>('[aria-label]').find(el => el.getAttribute('aria-label') === restoreLabel)?.focus();
    };
    minus.addEventListener('click', () => change(line.quantity-1, minus.getAttribute('aria-label')!));
    plus.addEventListener('click', () => change(line.quantity+1, plus.getAttribute('aria-label')!));
    input.addEventListener('change', () => change(input.valueAsNumber, input.getAttribute('aria-label')!));
    const remove = element('button', 'remove-item', 'Remover');
    remove.type = 'button'; remove.setAttribute('aria-label', `Remover ${product.name}`);
    remove.addEventListener('click', () => { updateCart(cart.filter(item => item.id !== line.id)); query<HTMLButtonElement>('[data-close-quote]')?.focus(); });
    controls.append(minus, input, plus); row.append(detail, controls, remove); list.append(row);
  }
  query('[data-empty-cart]')!.hidden = cart.length > 0;
  query<HTMLFormElement>('#quote-form')!.hidden = cart.length === 0;
  query<HTMLFieldSetElement>('[data-quote-fields]')!.disabled = cart.length === 0;
}

all<HTMLButtonElement>('[data-add]').forEach(button => button.addEventListener('click', () => {
  const product = products.find(p => p.id === button.dataset.add);
  if (!product) return;
  const existing = cart.find(item => item.id === product.id);
  const quantityInput = button.dataset.quantityInput ? document.getElementById(button.dataset.quantityInput) as HTMLInputElement | null : null;
  if (quantityInput && !quantityInput.reportValidity()) return;
  const amount = quantityInput ? quantityInput.valueAsNumber : 1;
  if (!Number.isInteger(amount) || amount < 1 || amount > MAX_QUANTITY) return;
  if (existing?.quantity === MAX_QUANTITY) { toast('Quantidade máxima atingida para este item.'); return; }
  const total = Math.min(MAX_QUANTITY, (existing?.quantity || 0) + amount);
  updateCart(existing ? cart.map(item => item.id === product.id ? { ...item, quantity: total } : item) : [...cart, { id: product.id, quantity: total }]);
  toast(storageAvailable ? `${product.name} adicionado à cotação.` : 'Item adicionado. Seu navegador não está salvando a lista entre páginas.');
}));

all<HTMLButtonElement>('[data-open-quote]').forEach(button => button.addEventListener('click', () => {
  previousFocus = document.activeElement as HTMLElement;
  invalidateMessage(); renderCart(); dialog.showModal(); document.body.classList.add('dialog-open');
}));
query('[data-close-quote]')?.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); previousFocus?.focus(); });
window.addEventListener('storage', event => {
  if (event.key !== storageKey && event.key !== null) return;
  try { cart = sanitizeCart(JSON.parse(event.newValue || '[]'), ids); } catch { cart = []; }
  invalidateMessage(); renderCart();
});

query<HTMLFormElement>('#quote-form')!.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const error = query('[data-form-error]')!;
  error.hidden = true;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  try {
    const message = quoteMessage(cart, products, { name: String(data.get('name') || ''), company: String(data.get('company') || ''), city: String(data.get('city') || ''), notes: String(data.get('notes') || '') }, company.demo);
    query('[data-message-text]')!.textContent = message;
    query<HTMLAnchorElement>('[data-message-link]')!.href = whatsappLink(company.whatsapp, message);
    form.hidden = true; query('[data-message-review]')!.hidden = false;
    query<HTMLAnchorElement>('[data-message-link]')!.focus();
  } catch (err) { error.textContent = err instanceof Error ? err.message : 'Revise os campos e tente novamente.'; error.hidden = false; }
});
query('[data-edit-message]')!.addEventListener('click', () => { invalidateMessage(); query<HTMLInputElement>('#quote-form input[name=name]')?.focus(); });

const menu = query<HTMLButtonElement>('[data-menu]')!;
const nav = query('#main-nav')!;
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Abrir menu'); nav.classList.remove('is-open'); }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu'); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => { if (!nav.contains(event.target as Node) && !menu.contains(event.target as Node)) closeMenu(); });

const search = query<HTMLInputElement>('#product-search');
if (search) {
  const filters = all<HTMLButtonElement>('[data-category-filter]');
  const cards = all<HTMLElement>('[data-product-card]');
  const grid = query('#products-grid')!;
  const sort = query<HTMLSelectElement>('#product-sort')!;
  const urlCategory = new URLSearchParams(location.search).get('categoria');
  let selected = categories.some(c => c.id === urlCategory) ? urlCategory! : 'all';
  function filter() {
    let count = 0;
    const term = normalize(search!.value);
    for (const card of cards) {
      const product = products.find(p => p.id === card.dataset.id)!;
      const categoryName = categories.find(c => c.id === product.category)!.name;
      const match = (selected === 'all' || product.category === selected) && normalize(`${product.name} ${product.description} ${categoryName}`).includes(term);
      card.hidden = !match; if (match) count++;
    }
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.categoryFilter === selected)));
    query('#results-count')!.textContent = `${count} ${count === 1 ? 'exemplo de produto' : 'exemplos de produtos'}`;
    query('#no-results')!.hidden = count !== 0;
    const ordered = [...cards].sort((a,b) => sort.value === 'category' ? ids.indexOf(a.dataset.id!)-ids.indexOf(b.dataset.id!) : (sort.value === 'za' ? -1 : 1) * a.dataset.name!.localeCompare(b.dataset.name!, 'pt-BR'));
    ordered.forEach(card => grid.append(card));
  }
  search.addEventListener('input', filter); sort.addEventListener('change', filter);
  filters.forEach(button => button.addEventListener('click', () => {
    selected = button.dataset.categoryFilter!;
    const url = new URL(location.href);
    if (selected === 'all') url.searchParams.delete('categoria'); else url.searchParams.set('categoria', selected);
    history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    filter();
  }));
  all('[data-clear-filters]').forEach(button => button.addEventListener('click', () => { selected = 'all'; search.value = ''; sort.value = 'category'; history.replaceState(null, '', location.pathname); filter(); search.focus(); }));
  filter();
}

const contactForm = query<HTMLFormElement>('#contact-form');
if (contactForm) {
  query<HTMLFieldSetElement>('[data-contact-fields]')!.disabled = false;
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const error = query('[data-contact-error]')!;
    error.hidden = true;
    if (!contactForm.reportValidity()) return;
    const data = new FormData(contactForm);
    const name = cleanField(String(data.get('name') || ''));
    const city = cleanField(String(data.get('city') || ''));
    if (!name || !city) { error.textContent = 'Informe seu nome e sua cidade.'; error.hidden = false; return; }
    const message = [company.demo ? '[CONTATO PELA APRESENTAÇÃO DO SITE ALFAWALI]' : 'Olá, ALFAWALI!', '', `Nome: ${name}`, `Empresa: ${cleanField(String(data.get('company') || '')) || 'Não informada'}`, `Cidade: ${city}`, `Interesse: ${cleanField(String(data.get('interest') || ''))}`, '', cleanField(String(data.get('message') || ''), 800)].join('\n');
    query('[data-contact-message]')!.textContent = message;
    query<HTMLAnchorElement>('[data-contact-link]')!.href = whatsappLink(company.whatsapp, message);
    contactForm.hidden = true; query('[data-contact-review]')!.hidden = false;
    query<HTMLAnchorElement>('[data-contact-link]')!.focus();
  });
  query('[data-contact-edit]')!.addEventListener('click', () => { contactForm.hidden = false; query('[data-contact-review]')!.hidden = true; query<HTMLAnchorElement>('[data-contact-link]')!.removeAttribute('href'); query('[data-contact-message]')!.textContent = ''; query<HTMLInputElement>('#contact-form input[name=name]')!.focus(); });
}
all<HTMLElement>('[data-product-gallery]').forEach(gallery => {
  const panels = [...gallery.querySelectorAll<HTMLElement>('[data-gallery-panel]')];
  const thumbnails = [...gallery.querySelectorAll<HTMLButtonElement>('[data-gallery-thumbnail]')];
  const captions = [...gallery.querySelectorAll<HTMLElement>('[data-gallery-caption]')];
  const viewer = gallery.querySelector<HTMLDialogElement>('[data-image-dialog]')!;
  const expand = gallery.querySelector<HTMLButtonElement>('[data-gallery-expand]')!;
  let selected = 0;
  function select(index: number) {
    selected = (index + thumbnails.length) % thumbnails.length;
    panels.forEach(panel => panel.hidden = Number(panel.dataset.galleryPanel) !== selected);
    thumbnails.forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.galleryThumbnail) === selected)));
    const current = panels.find(panel => Number(panel.dataset.galleryPanel) === selected)!;
    captions.forEach(caption => caption.textContent = `${selected + 1} / ${thumbnails.length} · ${current.getAttribute('aria-label')}`);
  }
  thumbnails.forEach(button => button.addEventListener('click', () => select(Number(button.dataset.galleryThumbnail))));
  gallery.querySelectorAll('[data-gallery-prev]').forEach(button => button.addEventListener('click', () => select(selected - 1)));
  gallery.querySelectorAll('[data-gallery-next]').forEach(button => button.addEventListener('click', () => select(selected + 1)));
  expand.addEventListener('click', () => { viewer.showModal(); document.body.classList.add('image-open'); });
  viewer.querySelector('[data-image-close]')!.addEventListener('click', () => viewer.close());
  viewer.addEventListener('close', () => { document.body.classList.remove('image-open'); expand.focus(); });
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); select(selected + (event.key === 'ArrowRight' ? 1 : -1)); }
  });
  viewer.addEventListener('click', event => {
    if (event.target !== viewer) return;
    const bounds = viewer.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) viewer.close();
  });
});
renderCart();
