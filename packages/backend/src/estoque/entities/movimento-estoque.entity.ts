// ==============================================================================
// Entidade - MovimentoEstoque
// Autor: Deivid Lucas
// Versão: 1.1
// Descrição: Adiciona o tipo de movimento para cancelamento de compra.
// ==============================================================================
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Estoque } from './estoque.entity';

export enum TipoMovimento {
  ENTRADA_RECEBIMENTO = 'entrada_recebimento',
  SAIDA_EXPEDICAO = 'saida_expedicao',
  SAIDA_AVARIA = 'saida_avaria',
  AJUSTE_INVENTARIO = 'ajuste_inventario',
  SALDO_INICIAL = 'saldo_inicial',
  ENTRADA_CANCELAMENTO_VENDA = 'entrada_cancelamento_venda',
  SAIDA_CANCELAMENTO_COMPRA = 'saida_cancelamento_compra', // Adicionar este tipo
}

@Entity({ name: 'movimentos_estoque' })
export class MovimentoEstoque {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Estoque, (estoque) => estoque.movimentos)
  estoque: Estoque;

  @Column({ type: 'enum', enum: TipoMovimento })
  tipo: TipoMovimento;

  @Column({ type: 'int' })
  quantidade: number;

  @Column({ type: 'int' })
  saldoAnterior: number;

  @Column({ type: 'text', nullable: true })
  observacao: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  documentoReferencia: string;

  @CreateDateColumn()
  dataMovimento: Date;
}
