import {test,expect} from '@playwright/test';

test('serviços têm detalhe, FAQ por teclado e contato contextual revisável',async({page})=>{
  await page.goto('servicos/');
  await page.locator('#terceirizacao').getByRole('link',{name:'Ver escopo e contratação'}).click();
  await expect(page).toHaveURL(/servicos\/terceirizacao\//);
  await expect(page.locator('h1')).toContainText('Terceirização de mão de obra');
  const question=page.locator('summary').filter({hasText:'Os materiais e equipamentos estão incluídos?'});
  await question.focus();
  await page.keyboard.press('Enter');
  await expect(question.locator('..')).toHaveAttribute('open','');
  await expect(page.getByText('Não há uma condição única confirmada nesta prévia.')).toBeVisible();
  await page.getByRole('link',{name:'Solicitar avaliação',exact:true}).click();
  await expect(page.locator('select[name=interest]')).toHaveValue('Terceirização de mão de obra');
  await page.locator('#contact-form input[name=name]').fill('Teste');
  await page.locator('#contact-form input[name=city]').fill('Guaíba');
  await page.getByRole('button',{name:'Preparar contato'}).click();
  await expect(page.locator('[data-contact-message]')).toContainText('Interesse: Terceirização de mão de obra');
  await expect(page.locator('[data-contact-link]')).toHaveAttribute('href',/^https:\/\/wa.me\//);
  await page.goto('servicos/limpeza/');
  await expect(page.getByText('Escopo em validação.',{exact:false})).toBeVisible();
});
