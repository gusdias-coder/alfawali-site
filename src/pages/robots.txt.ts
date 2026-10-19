import { isProd } from '../lib/env';
// Indexação controlada por ambiente: PUBLISH_ENV=production libera; qualquer outro valor bloqueia.
export const GET = ({ site }: { site?: URL }) => {
  const body = isProd ? `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml', site).href}\n` : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
