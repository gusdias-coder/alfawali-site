import { test, expect } from '@playwright/test';
import { products } from '../../src/data/products';
import { categories, services } from '../../src/data/company';

test('tema padrão acompanha o sistema; escolha manual persiste e pode ser removida', async ({page}) => {
  await page.emulateMedia({colorScheme:'light'});
  await page.goto('');
  const theme = page.getByRole('combobox',{name:'Aparência',exact:true});
  await expect(theme).toHaveValue('system');
  const light = await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor);
  await page.emulateMedia({colorScheme:'dark'});
  const dark = await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor);
  expect(dark).not.toBe(light);
  await theme.selectOption('light');
  await page.reload();
  await expect(theme).toHaveValue('light');
  expect(await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor)).toBe(light);
  await theme.selectOption('dark');
  await page.goto('produtos/');
  await expect(theme).toHaveValue('dark');
  expect(await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor)).toBe(dark);
  await theme.selectOption('system');
  expect(await page.evaluate(()=>localStorage.getItem('alfawali:theme'))).toBeNull();
  await page.emulateMedia({colorScheme:'light'});
  expect(await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor)).toBe(light);
});

test('temas funcionam sem armazenamento disponível', async ({page}) => {
  await page.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('negado');}});});
  await page.goto('');
  await page.getByRole('combobox',{name:'Aparência',exact:true}).selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await page.getByRole('combobox',{name:'Aparência',exact:true}).selectOption('light');
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  await page.getByRole('button',{name:'Adicionar Limpador multiuso à cotação',exact:true}).click();
  await expect(page.locator('[data-cart-count]')).toHaveText('1');
});

test('páginas nos dois temas em celular, tablet e desktop', async ({page},testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');
  test.setTimeout(90000);
  const routes=['','produtos/','orcamento/','empresa/','servicos/','atendimento/','contato/','privacidade/','condicoes/','404.html',...products.map(p=>`produtos/${p.id}/`),...categories.map(c=>`produtos/categoria/${c.id}/`),...services.map(s=>`servicos/${s.id}/`)];
  for (const width of [390,768,1440]) {
    await page.setViewportSize({width,height:1000});
    for (const theme of ['light','dark'] as const) {
      await page.emulateMedia({colorScheme:theme});
      for (const route of routes) {
        await page.goto(route);
        await expect(page.locator('h1')).toHaveCount(1);
        await expect(page.locator('h1')).toBeVisible();
        expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        if (route === '') {
          await page.locator('.services-home h2').scrollIntoViewIfNeeded();
          await page.locator('.footer-brand').scrollIntoViewIfNeeded();
          await page.locator('h1').scrollIntoViewIfNeeded();
          await page.screenshot({path:`output/screenshots/final-${width}-${theme}.png`,fullPage:true,animations:'disabled'});
          if (width === 1440) await page.screenshot({path:`output/screenshots/previa-${theme}.png`,fullPage:false,animations:'disabled'});
        }
      }
    }
  }
});

test('contraste dos tokens e movimento reduzido nos dois temas', async ({page},testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');
  for (const theme of ['light','dark'] as const) {
    await page.emulateMedia({colorScheme:theme,reducedMotion:'reduce'});
    await page.goto('');
    const ratios = await page.evaluate(() => {
      const css = getComputedStyle(document.documentElement);
      const luminance = (key:string) => {
        const raw=css.getPropertyValue(key).trim().replace('#','');
        const hex=raw.length===3 ? [...raw].map(c=>c+c).join('') : raw;
        const linear=hex.match(/.{2}/g)!.map(h=>parseInt(h,16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);
        return .2126*linear[0]+.7152*linear[1]+.0722*linear[2];
      };
      const pairs=[['--text','--background',4.5],['--text-muted','--surface-alt',4.5],['--accent','--surface-alt',4.5],['--on-action','--action',4.5],['--on-strong','--strong',4.5],['--notice-text','--notice',4.5],['--error','--error-surface',4.5],['--input-border','--surface',3],['--input-border','--background',3],['--focus','--surface-alt',3]] as const;
      return pairs.map(([a,b,required])=>{const [x,y]=[luminance(a),luminance(b)].sort((a,b)=>b-a);return {pair:`${a}/${b}`,ratio:(x+.05)/(y+.05),required};});
    });
    for (const result of ratios) expect(result.ratio,`${theme}: ${result.pair}`).toBeGreaterThanOrEqual(result.required);
    expect(await page.locator('.button').first().evaluate(el=>getComputedStyle(el).transitionDuration)).toBe('0s');
  }
});

test('sem JavaScript conserva navegação e conteúdo e oculta controles dependentes', async ({browser}) => {
  const context = await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/');
  await expect(page.getByRole('navigation',{name:'Menu principal'})).toBeVisible();
  await expect(page.getByRole('combobox',{name:'Aparência',exact:true})).toBeHidden();
  await page.getByRole('navigation',{name:'Menu principal'}).getByRole('link',{name:'Produtos',exact:true}).click();
  await expect(page.locator('[data-product-card]')).toHaveCount(16);
  await expect(page.locator('#product-search')).toBeHidden();
  await expect(page.locator('[data-add]').first()).toBeHidden();
  await page.getByRole('navigation',{name:'Categorias de produtos'}).getByRole('link',{name:'Químicos',exact:true}).click();
  await expect(page.locator('h1')).toContainText('Químicos');
  await expect(page.locator('[data-product-card]')).toHaveCount(2);
  await page.goto('http://127.0.0.1:4321/servicos/terceirizacao/');
  await page.locator('summary').filter({hasText:'Quais cidades são atendidas?'}).click();
  await expect(page.getByText('A cobertura depende do serviço e do local.',{exact:false})).toBeVisible();
  await context.close();
});
