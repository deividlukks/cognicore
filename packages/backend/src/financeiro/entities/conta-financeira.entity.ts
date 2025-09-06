// ==============================================================================
// Entidade - ContaFinanceira
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: Representa uma conta financeira, como um caixa ou uma conta bancária,
//            onde os lançamentos de entrada e saída são registados.
// ==============================================================================
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Lancamento } from './lancamento.entity';

export enum TipoConta {
  CAIXA = 'caixa',
  BANCO = 'banco',
}

@Entity({ name: 'contas_financeiras' })
export class ContaFinanceira {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  nome: string; // Ex: "Caixa da Loja", "Banco do Brasil C/C"

  @Column({ type: 'enum', enum: TipoConta, default: TipoConta.CAIXA })
  tipo: TipoConta;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  saldoInicial: number;

  // O saldo atual será calculado com base nos lançamentos
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  saldoAtual: number;

  @Column({ type: 'boolean', default: true })
  ativa: boolean;

  @OneToMany(() => Lancamento, (lancamento) => lancamento.contaFinanceira)
  lancamentos: Lancamento[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
