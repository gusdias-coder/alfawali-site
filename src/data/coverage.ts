// Matriz de cobertura (escopo, pacote 3). Preencher somente com atendimento confirmado pelo responsável.
export type CoverageStatus = 'confirmado' | 'sob_consulta' | 'nao_atendido';
export interface Coverage {
  type: 'produto' | 'servico';
  item: string;
  city: string;
  uf: string;
  status: CoverageStatus;
  mode?: string;
  leadTime?: string;
  minOrder?: string;
  freight?: string;
  restrictions?: string;
  approvedAt: string;
}
export const coverage: Coverage[] = [];
export const coverageFallback = 'Consulte a disponibilidade para sua cidade no Rio Grande do Sul.';
