export const company = {
  name: 'ALFAWALI',
  tagline: 'Produtos e serviços para a sua operação.',
  region: 'Rio Grande do Sul',
  whatsapp: '5551991005271',
  phoneDisplay: '(51) 99100-5271',
  demo: true,
  // Preencher somente com informações oficiais fornecidas pela empresa.
  email: '',
  address: '',
  cnpj: '52.892.758/0001-85',
  legalName: 'ALFAWALI COMERCIO VAREJISTA DE SUPRIMENTOS E PRESTACAO DE SERVICOS TERCEIRIZADOS LTDA',
  // Só vira true depois que o responsável revisar privacidade e condições.
  policiesReviewed: false,
};

export const clients: { name: string; logo: string }[] = [];

export const categories = [
  { id: 'coffee', name: 'Coffee', label: 'Para servir bem.', description: 'Itens para a copa, o café e os pequenos intervalos da rotina.', icon: 'coffee' },
  { id: 'office', name: 'Office', label: 'Cada detalhe em ordem.', description: 'Materiais de escritório e papelaria para o dia a dia.', icon: 'office' },
  { id: 'sacos', name: 'Sacos para lixo', label: 'Cuidado do início ao fim.', description: 'Soluções para acondicionamento e descarte de resíduos.', icon: 'bag' },
  { id: 'copos', name: 'Copos', label: 'Praticidade para servir.', description: 'Descartáveis para diferentes ambientes e necessidades.', icon: 'cup' },
  { id: 'dispensers', name: 'Dispensers', label: 'Higiene ao alcance.', description: 'Organização e distribuição de insumos de higiene.', icon: 'dispenser' },
  { id: 'papeis', name: 'Papéis', label: 'Essenciais no cotidiano.', description: 'Papéis para higiene e cuidado dos ambientes.', icon: 'paper' },
  { id: 'quimicos', name: 'Químicos', label: 'Limpeza para cada rotina.', description: 'Produtos de limpeza para diferentes superfícies e usos.', icon: 'bottle' },
  { id: 'equipamentos', name: 'Equipamentos', label: 'Apoio para fazer melhor.', description: 'Utensílios e equipamentos para a rotina de limpeza.', icon: 'equipment' },
] as const;

export type CategoryId = typeof categories[number]['id'];
export const services = [
  { id: 'terceirizacao', number: '01', title: 'Terceirização de mão de obra', description: 'Converse com a ALFAWALI sobre as necessidades da sua operação. A proposta de atendimento considera as atividades, os locais e a rotina da empresa.', items: ['Levantamento das necessidades', 'Definição do escopo de trabalho', 'Proposta de atendimento sob consulta'], icon: 'people' },
  { id: 'limpeza', number: '02', title: 'Limpeza de empresas e ambientes', description: 'Serviços de limpeza para empresas, prédios e outros ambientes, com o escopo definido conforme a necessidade de cada local.', items: ['Limpeza empresarial', 'Limpeza de prédios e domicílios', 'Rotinas ajustadas ao ambiente'], icon: 'sparkles' },
  { id: 'apoio', number: '03', title: 'Apoio à operação', description: 'Apresente sua demanda de apoio administrativo e de serviços ao funcionamento da empresa. A disponibilidade e as condições serão avaliadas no atendimento.', items: ['Apoio administrativo sob consulta', 'Serviços de apoio a edifícios', 'Atendimento para necessidades específicas'], icon: 'office' },
];
