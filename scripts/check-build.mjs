import { readdir, readFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import assert from 'node:assert/strict';
const root = resolve('dist');
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = process.env.SITE_BASE || (repo ? `/${repo}/` : '/');
async function walk(dir) { const entries = await readdir(dir,{withFileTypes:true}); return (await Promise.all(entries.map(e => e.isDirectory() ? walk(join(dir,e.name)) : join(dir,e.name)))).flat(); }
const files = await walk(root);
for (const file of files.filter(f => f.endsWith('.html'))) {
  const html = await readFile(file,'utf8');
  assert.match(html,/noindex/,'Apresentação deve permanecer noindex');
  assert.match(html,/Content-Security-Policy/);
  assert.ok(!/<script\b(?![^>]*\bsrc=)[^>]*>/i.test(html),`Script inline: ${file}`);
  assert.ok(!/\son(?:click|load|error)=/i.test(html),`Handler inline: ${file}`);
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    let ref = match[1].split(/[?#]/)[0];
    if (!ref || /^(https?:|tel:|data:)/.test(ref)) continue;
    assert.ok(ref.startsWith(base),`Caminho fora da base: ${ref}`);
    const path = join(root,decodeURIComponent(ref.slice(base.length)));
    const info = await stat(path).catch(() => null);
    assert.ok(info,`Link/recurso inexistente: ${ref}`);
    if (info.isDirectory()) await stat(join(path,'index.html'));
  }
}
console.log(`${files.filter(f=>f.endsWith('.html')).length} páginas: links, recursos locais e CSP verificados.`);
