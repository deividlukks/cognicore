// ==============================================================================
// Entidade - ContaReceber
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: Representa uma conta a receber de um cliente, com todos os
//            detalhes do crédito e do recebimento.
// ==============================================================================
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Generated,
} from 'typeorm';
import { Cliente } from '../../vendas/entities/cliente.entity';
import { Lancamento } from './lancamento.entity';
import { ContaFinanceira } from './conta-financeira.entity';

export enum StatusContaReceber {
  ABERTA = 'aberta',
  RECEBIDA = 'recebida',
  VENCIDA = 'vencida',
  CANCELADA = 'cancelada',
}

@Entity({ name: 'contas_receber' })
export class ContaReceber {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', unique: true })
  @Generated('increment')
  numeroDocumento: number;

  // --- Dados do Crédito ---
  @ManyToOne(() => Cliente)
  cliente: Cliente;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  valor: number;

  @Column({ type: 'date' })
  dataEmissao: Date;

  @Column({ type: 'date' })
  dataCompetencia: Date;

  @Column({ type: 'date' })
  dataVencimento: Date;

  @Column({ type: 'enum', enum: StatusContaReceber, default: StatusContaReceber.ABERTA })
  status: StatusContaReceber;

  // --- Dados do Recebimento (preenchidos quando a conta é recebida) ---
  @Column({ type: 'date', nullable: true })
  dataRecebimento: Date;

  @Column({ type: 'varchar', nullable: true })
  formaPagamento: string;

  @ManyToOne(() => ContaFinanceira, { nullable: true })
  contaFinanceira: ContaFinanceira;

  // Quando a conta é recebida, ela gera um lançamento.
  @OneToOne(() => Lancamento, { nullable: true })
  @JoinColumn()
  lancamento: Lancamento;

  @Column({ type: 'varchar', nullable: true })
  numeroNoBanco: string;

  @Column({ type: 'varchar', nullable: true })
  categoria: string;

  @Column({ type: 'varchar', nullable: true }) // Armazenará o ID do Vendedor
  vendedorId: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  juros: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  multa: number;

  @Column({ type: 'varchar', nullable: true })
  anexoUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
