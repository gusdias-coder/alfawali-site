import { test, expect } from '@playwright/test';
test('todas as páginas, sem erros, imagens carregadas e sem overflow', async ({page},testInfo) => {
  const errors: string[]=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error') errors.push(m.text());});
  for (const route of ['', 'empresa/', 'servicos/', 'produtos/', 'contato/', 'privacidade/']) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
    await page.evaluate(()=>document.fonts.ready);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
    expect(await page.locator('img').evaluateAll(imgs=>imgs.every(img=>(img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth>0))).toBe(true);
    await page.screenshot({path:`output/screenshots/${testInfo.project.name}-${route.replace('/','')||'inicio'}.png`,fullPage:true});
  }
  expect(errors).toEqual([]);
});
test('busca, categorias e lista vazia de resultados',async({page})=>{
  await page.goto('produtos/');
  await expect(page.locator('[data-product-card]:visible')).toHaveCount(16);
  await page.locator('[data-category-filter="quimicos"]').click();
  await expect(page.locator('[data-product-card]:visible')).toHaveCount(2);
  await page.locator('[data-category-filter="all"]').click();
  await page.locator('#product-search').fill('CAFE');
  await expect(page.locator('[data-product-card]:visible')).toHaveCount(3);
  await page.locator('#product-search').fill('produto inexistente');
  await expect(page.locator('#no-results')).toBeVisible();
  await page.getByRole('button',{name:'Ver todos os produtos'}).click();
  await expect(page.locator('[data-product-card]:visible')).toHaveCount(16);
});
test('cotação persiste, revisa mensagem e trata texto como texto',async({page})=>{
  await page.goto('produtos/');
  await page.locator('[data-add="coffee-01"]').click();
  await page.locator('[data-add="coffee-01"]').click();
  await page.reload();
  await page.locator('[data-open-quote]').click();
  await expect(page.locator('.quantity-controls input')).toHaveValue('2');
  await page.locator('#quote-form input[name="name"]').fill('<img src=x onerror=alert(1)>');
  await page.locator('#quote-form input[name="city"]').fill('Porto Alegre');
  await page.getByRole('button',{name:'Preparar mensagem'}).click();
  await expect(page.locator('[data-message-text]')).toContainText('<img src=x onerror=alert(1)>');
  await expect(page.locator('[data-message-text] img')).toHaveCount(0);
  const href=await page.locator('[data-message-link]').getAttribute('href');
  const url=new URL(href!); expect(url.hostname).toBe('wa.me');expect(url.pathname).toBe('/5551991005271');
  expect(url.searchParams.get('text')).toContain('2 embalagem(s)');
  expect(url.searchParams.get('text')).toContain('DEMONSTRAÇÃO');
  await page.getByRole('button',{name:'Voltar e editar'}).click();
  await page.locator('[data-close-quote]').click();
  expect(await page.evaluate(()=>JSON.stringify(localStorage))).not.toContain('Porto Alegre');
});
test('contato exige dados, gera revisão e permite editar',async({page})=>{
  await page.goto('contato/');
  await page.getByRole('button',{name:'Preparar contato'}).click();
  await expect(page.locator('[data-contact-review]')).toBeHidden();
  await page.locator('#contact-form input[name="name"]').fill('Teste de apresentação');
  await page.locator('#contact-form input[name="city"]').fill('Canoas');
  await page.getByRole('button',{name:'Preparar contato'}).click();
  await expect(page.locator('[data-contact-message]')).toContainText('Canoas');
  expect(await page.locator('[data-contact-link]').getAttribute('href')).toContain('https://wa.me/5551991005271?text=');
  await page.getByRole('button',{name:'Voltar e editar'}).click();
  await expect(page.locator('#contact-form')).toBeVisible();
});
test('armazenamento corrompido não interrompe o catálogo',async({page})=>{
  await page.addInitScript(()=>localStorage.setItem('alfawali:quote:v1:/alfawali-site/','invalid-json'));
  await page.goto('produtos/?categoria=copos');
  await expect(page.locator('[data-product-card]:visible')).toHaveCount(2);
  await page.locator('[data-add="copos-01"]').click();
  await page.locator('[data-open-quote]').click();
  await expect(page.locator('.quote-item')).toHaveCount(1);
});
test('menu de celular acessível',async({page},testInfo)=>{
  test.skip(testInfo.project.name!=='mobile');
  await page.goto('');
  await page.getByRole('button',{name:'Abrir menu'}).click();
  await expect(page.getByRole('navigation',{name:'Menu principal'})).toBeVisible();
  await page.getByRole('navigation',{name:'Menu principal'}).getByRole('link',{name:'Produtos'}).click();
  await expect(page.locator('#product-search')).toBeVisible();
});

test('detalhes do produto, galeria ampliada e quantidade na cotação',async({page},testInfo)=>{
  const errors:string[]=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('produtos/?categoria=quimicos');
  await page.locator('[data-id="quimicos-01"]').getByRole('link',{name:'Ver detalhes',exact:true}).click();
  await expect(page).toHaveURL(/\/produtos\/quimicos-01\/$/);
  await expect(page.locator('h1')).toContainText('Limpador multiuso');
  await expect(page.getByRole('heading',{name:'Descrição completa.'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Ficha técnica.'})).toBeVisible();
  await expect(page.locator('dl')).toContainText('Tamanho / dimensões');
  await expect(page.locator('dl')).toContainText('Peso');
  await page.locator('[data-gallery-thumbnail="1"]').click();
  await expect(page.locator('[data-gallery-thumbnail="1"]')).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button',{name:'Ampliar imagem'}).click();
  const viewer=page.locator('[data-image-dialog]');
  await expect(viewer).toBeVisible();
  await viewer.getByRole('button',{name:'Próxima imagem'}).click();
  await expect(viewer.locator('[data-gallery-caption]')).toContainText('1 / 2');
  await page.keyboard.press('ArrowRight');
  await expect(viewer.locator('[data-gallery-caption]')).toContainText('2 / 2');
  await page.keyboard.press('Escape');
  await expect(viewer).not.toBeVisible();
  await expect(page.getByRole('button',{name:'Ampliar imagem'})).toBeFocused();
  await page.locator('#detail-quantity').fill('4');
  await page.getByRole('button',{name:'Adicionar à cotação',exact:true}).click();
  await page.locator('[data-open-quote]').click();
  await expect(page.locator('.quantity-controls input')).toHaveValue('4');
  await page.locator('[data-close-quote]').click();
  await page.screenshot({path:`output/screenshots/${testInfo.project.name}-detalhe-produto.png`,fullPage:true});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
  await page.getByRole('link',{name:'← Voltar para Químicos'}).click();
  await expect(page).toHaveURL(/categoria=quimicos/);
  await expect(page.locator('[data-product-card]:visible')).toHaveCount(2);
  expect(errors).toEqual([]);
});

test('quantidade inválida não entra na lista pelo detalhe',async({page})=>{
  await page.goto('produtos/coffee-01/');
  for(const quantity of ['0','1000','1.5','']) {
    await page.locator('#detail-quantity').fill(quantity);
    await page.getByRole('button',{name:'Adicionar à cotação',exact:true}).click();
    await expect(page.locator('[data-cart-count]')).toHaveText('0');
  }
  await page.locator('#detail-quantity').fill('999');
  await page.getByRole('button',{name:'Adicionar à cotação',exact:true}).click();
  await page.locator('#detail-quantity').fill('1');
  await page.getByRole('button',{name:'Adicionar à cotação',exact:true}).click();
  await page.locator('[data-open-quote]').click();
  await expect(page.locator('.quantity-controls input')).toHaveValue('999');
});
