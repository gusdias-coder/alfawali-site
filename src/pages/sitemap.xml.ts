import { isProd } from '../lib/env';
import { categories, services } from '../data/company';
import { products } from '../data/products';

const fixed = ['', 'produtos/', 'servicos/', 'orcamento/', 'contato/', 'atendimento/', 'empresa/', 'privacidade/', 'condicoes/'];
export const GET = ({ site }: { site?: URL }) => {
  const base = import.meta.env.BASE_URL;
  const routes = [
    ...fixed,
    ...services.map(service => `servicos/${service.id}/`),
    ...categories.filter(c => products.some(p => p.category === c.id)).map(c => `produtos/categoria/${c.id}/`),
    ...products.map(p => `produtos/${p.id}/`),
  ];
  const urls = isProd ? routes.map(r => `<url><loc>${new URL(base.replace(/\/$/, '') + '/' + r, site).href}</loc></url>`).join('') : '';
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
