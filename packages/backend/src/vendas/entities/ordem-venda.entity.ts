// ==============================================================================
// Entidade - OrdemVenda
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: Representa o cabeçalho de uma ordem de venda no sistema.
// ==============================================================================
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Generated,
} from 'typeorm';
import { Cliente } from './cliente.entity';
import { ItemOrdemVenda } from './item-ordem-venda.entity';

export enum StatusOrdemVenda {
  EM_ABERTO = 'em_aberto',
  FATURADO = 'faturado',
  CANCELADO = 'cancelado',
}

@Entity({ name: 'ordens_venda' })
export class OrdemVenda {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', unique: true })
  @Generated('increment')
  numero: number;

  @ManyToOne(() => Cliente)
  cliente: Cliente;

  @OneToMany(() => ItemOrdemVenda, (item) => item.ordemVenda, { cascade: true })
  itens: ItemOrdemVenda[];

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  valorTotal: number;

  @Column({ type: 'enum', enum: StatusOrdemVenda, default: StatusOrdemVenda.EM_ABERTO })
  status: StatusOrdemVenda;

  @CreateDateColumn()
  dataVenda: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
