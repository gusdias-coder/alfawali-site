import type { CategoryId } from './company';

export interface ProductImage { src: string; alt: string }
export interface ProductSpecifications {
  brand?: string;
  reference?: string;
  dimensions?: string;
  weight?: string;
  capacity?: string;
  material?: string;
  color?: string;
  packaging?: string;
  additional?: { label: string; value: string }[];
}

export interface Product {
  id: string;
  name: string;
  status: 'draft' | 'approved' | 'retired';
  packaging: string;
  minimum: number;
  multiple: number;
  pricePolicy: 'quote' | 'fixed';
  priceCents?: number;
  priceValidUntil?: string;
  availabilityText: string;
  updatedAt: string;
  category: CategoryId;
  description: string;
  unit: string;
  illustration: string;
  demo: boolean;
  fullDescription?: string[];
  specifications?: ProductSpecifications;
  images?: ProductImage[];
}

// Exemplos genéricos para apresentação, não correspondem a estoque confirmado.
const demoProducts: Omit<Product, 'status' | 'packaging' | 'minimum' | 'multiple' | 'pricePolicy' | 'availabilityText' | 'updatedAt'>[] = [
  { id: 'coffee-01', name: 'Café para a sua empresa', category: 'coffee', description: 'Exemplo de item para abastecimento da copa. Marca e embalagem a confirmar.', unit: 'embalagem', illustration: 'coffee', demo: true },
  { id: 'coffee-02', name: 'Açúcar em sachês', category: 'coffee', description: 'Exemplo de produto porcionado para a rotina do café.', unit: 'caixa', illustration: 'coffee', demo: true },
  { id: 'office-01', name: 'Papel para escritório', category: 'office', description: 'Exemplo de suprimento para atividades administrativas.', unit: 'pacote', illustration: 'office', demo: true },
  { id: 'office-02', name: 'Materiais de papelaria', category: 'office', description: 'Exemplo de itens para organização do ambiente de trabalho.', unit: 'kit', illustration: 'office', demo: true },
  { id: 'sacos-01', name: 'Saco para lixo', category: 'sacos', description: 'Exemplo de material para descarte. Medidas e capacidade a confirmar.', unit: 'pacote', illustration: 'bag', demo: true },
  { id: 'sacos-02', name: 'Saco para coleta seletiva', category: 'sacos', description: 'Exemplo de solução para organização e separação de resíduos.', unit: 'pacote', illustration: 'bag', demo: true },
  { id: 'copos-01', name: 'Copo descartável', category: 'copos', description: 'Exemplo para servir bebidas. Material e capacidade a confirmar.', unit: 'pacote', illustration: 'cup', demo: true },
  { id: 'copos-02', name: 'Copo para café', category: 'copos', description: 'Exemplo de descartável para os intervalos do trabalho.', unit: 'pacote', illustration: 'cup', demo: true },
  { id: 'dispensers-01', name: 'Dispenser de sabonete', category: 'dispensers', description: 'Exemplo de acessório para ambientes de higiene.', unit: 'unidade', illustration: 'dispenser', demo: true },
  { id: 'dispensers-02', name: 'Dispenser de papel', category: 'dispensers', description: 'Exemplo de suporte para distribuição de papel.', unit: 'unidade', illustration: 'dispenser', demo: true },
  { id: 'papeis-01', name: 'Papel toalha', category: 'papeis', description: 'Exemplo de insumo para higiene e cuidado diário.', unit: 'pacote', illustration: 'paper', demo: true },
  { id: 'papeis-02', name: 'Papel higiênico', category: 'papeis', description: 'Exemplo para reposição em banheiros e áreas de uso comum.', unit: 'pacote', illustration: 'paper', demo: true },
  { id: 'quimicos-01', name: 'Limpador multiuso', category: 'quimicos', description: 'Exemplo de produto de limpeza. Aplicações e diluição dependem do fabricante.', unit: 'embalagem', illustration: 'bottle', demo: true },
  { id: 'quimicos-02', name: 'Detergente', category: 'quimicos', description: 'Exemplo de insumo de limpeza. Formulação e volume a confirmar.', unit: 'embalagem', illustration: 'bottle', demo: true },
  { id: 'equipamentos-01', name: 'Conjunto de limpeza', category: 'equipamentos', description: 'Exemplo de utensílios de apoio para a limpeza dos ambientes.', unit: 'kit', illustration: 'equipment', demo: true },
  { id: 'equipamentos-02', name: 'Balde para limpeza', category: 'equipamentos', description: 'Exemplo de equipamento para apoio às tarefas de limpeza.', unit: 'unidade', illustration: 'equipment', demo: true },
];

// Regras da demonstração; não representam mínimos ou embalagens comerciais aprovados.
export const products: Product[] = demoProducts.map(product => ({
  ...product, status: 'draft', packaging: 'Apresentação a confirmar', minimum: 1, multiple: 1,
  pricePolicy: 'quote', availabilityText: 'Disponibilidade e prazo serão confirmados na proposta.', updatedAt: '2026-10-18',
}));

// Preencha os campos com dados aprovados pelo fornecedor; imagens locais em public/.
export function productSpecifications(product: Product) {
  const specs = product.specifications || {};
  return [
    { label: 'Marca', value: specs.brand || 'A confirmar' },
    { label: 'Referência do fabricante', value: specs.reference || 'A confirmar' },
    { label: 'Tamanho / dimensões', value: specs.dimensions || 'A confirmar' },
    { label: 'Peso', value: specs.weight || 'A confirmar' },
    { label: 'Volume / capacidade', value: specs.capacity || 'A confirmar' },
    { label: 'Material / composição', value: specs.material || 'A confirmar' },
    { label: 'Cor', value: specs.color || 'A confirmar' },
    { label: 'Embalagem / apresentação', value: specs.packaging || product.packaging },
    { label: 'Unidade de cotação', value: product.unit },
    { label: 'Quantidade mínima', value: product.demo ? 'A confirmar' : String(product.minimum) },
    { label: 'Múltiplo de cotação', value: product.demo ? 'A confirmar' : String(product.multiple) },
    ...(specs.additional || []),
  ];
}
