// ==============================================================================
// Entidade - Lancamento
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: Representa um único lançamento financeiro (entrada ou saída)
//            associado a uma conta, categoria e, opcionalmente, a um
//            cliente/fornecedor.
// ==============================================================================
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ContaFinanceira } from './conta-financeira.entity';
import { Cliente } from '../../vendas/entities/cliente.entity';

export enum TipoLancamento {
  ENTRADA = 'entrada',
  SAIDA = 'saida',
}

@Entity({ name: 'lancamentos' })
export class Lancamento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ContaFinanceira, (conta) => conta.lancamentos)
  contaFinanceira: ContaFinanceira;

  // Opcionalmente, associar a um cliente ou fornecedor
  @ManyToOne(() => Cliente, { nullable: true })
  clienteFornecedor: Cliente;

  @Column({ type: 'enum', enum: TipoLancamento })
  tipo: TipoLancamento;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  valor: number;

  @Column({ type: 'varchar', length: 255 })
  historico: string; // Descrição do lançamento

  @Column({ type: 'varchar', length: 255, nullable: true })
  categoria: string; // Ex: "Venda de Mercadorias", "Despesa com Aluguel"

  @Column({ type: 'date' })
  competencia: Date; // O mês/ano a que a despesa/receita se refere

  @CreateDateColumn()
  dataLancamento: Date;

  @Column({ type: 'varchar', nullable: true })
  anexoUrl: string;
}
