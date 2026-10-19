import { company, categories } from '../src/data/company.ts';
import { products } from '../src/data/products.ts';
import { validateContent } from '../src/lib/content.ts';

const strict = process.env.PUBLISH_ENV === 'production';
const issues = validateContent({ company, categories, products, strict });
if (issues.length) {
  console.error(`Conteúdo inválido (${strict ? 'produção' : 'prévia'}):`);
  for (const i of issues) console.error(`- [${i.scope}] ${i.message}`);
  process.exit(1);
}
console.log(`Conteúdo válido (${strict ? 'produção' : 'prévia'}): ${products.length} produtos.`);
