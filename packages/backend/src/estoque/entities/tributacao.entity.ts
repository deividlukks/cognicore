// ==============================================================================
// Entidade - Tributacao
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: Armazena todas as informações fiscais e tributárias de um produto.
// ==============================================================================
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Produto } from './produto.entity';

@Entity({ name: 'tributacoes' })
export class Tributacao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Produto, (produto) => produto.tributacao)
  @JoinColumn() // Define que esta entidade terá a chave estrangeira
  produto: Produto;

  @Column({ type: 'varchar', length: 100, nullable: true })
  origem: string;

  @Column({ type: 'varchar', length: 8, nullable: true }) // Nomenclatura Comum do Mercosul
  ncm: string;

  @Column({ type: 'varchar', length: 7, nullable: true }) // Código Especificador da Substituição Tributária
  cest: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  tipoItem: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  percentualTributos: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  grupoProdutos: string;

  // Campos para ICMS, IPI, PIS/COFINS podem ser armazenados como JSONB
  // para maior flexibilidade, ou como colunas separadas se forem fixos.
  // Usaremos JSONB por ser mais adaptável.
  @Column({ type: 'jsonb', nullable: true })
  icms: object;

  @Column({ type: 'jsonb', nullable: true })
  ipi: object;

  @Column({ type: 'jsonb', nullable: true })
  pisCofins: object;

  @Column({ type: 'text', nullable: true })
  informacoesAdicionais: string;
}
