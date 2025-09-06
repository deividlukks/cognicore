// ==============================================================================
// Entidade - ContaPagar
// Autor: Deivid Lucas
// Versão: 1.1
// Descrição: Representa uma conta a pagar a um fornecedor, agora incluindo
//            o campo 'categoria'.
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
} from 'typeorm';
import { Cliente } from '../../vendas/entities/cliente.entity';
import { Lancamento } from './lancamento.entity';
import { ContaFinanceira } from './conta-financeira.entity';

export enum StatusContaPagar {
  ABERTA = 'aberta',
  PAGA = 'paga',
  VENCIDA = 'vencida',
  CANCELADA = 'cancelada',
}

@Entity({ name: 'contas_pagar' })
export class ContaPagar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- Dados da Dívida ---
  @ManyToOne(() => Cliente)
  fornecedor: Cliente;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  valor: number;

  @Column({ type: 'date' })
  dataEmissao: Date;

  @Column({ type: 'date' })
  dataCompetencia: Date;

  @Column({ type: 'date' })
  dataVencimento: Date;

  @Column({ type: 'text' })
  historico: string;

  @Column({ type: 'enum', enum: StatusContaPagar, default: StatusContaPagar.ABERTA })
  status: StatusContaPagar;

  // --- Dados do Pagamento (preenchidos quando a conta é paga) ---
  @Column({ type: 'date', nullable: true })
  dataPagamento: Date;

  @Column({ type: 'varchar', nullable: true })
  formaPagamento: string;

  @ManyToOne(() => ContaFinanceira, { nullable: true })
  contaFinanceira: ContaFinanceira;

  @OneToOne(() => Lancamento, { nullable: true })
  @JoinColumn()
  lancamento: Lancamento;

  @Column({ type: 'varchar', nullable: true })
  numeroDocumento: string;

  // --- CAMPO ADICIONADO ---
  @Column({ type: 'varchar', length: 255, nullable: true })
  categoria: string;

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
