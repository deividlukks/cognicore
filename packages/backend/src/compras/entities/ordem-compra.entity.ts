// ==============================================================================
// Entidade - OrdemCompra
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: Representa o cabeçalho de uma ordem de compra no sistema,
//            ligada a um fornecedor.
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
import { Cliente } from '../../vendas/entities/cliente.entity'; // Reutilizamos a entidade Cliente como Fornecedor
import { ItemOrdemCompra } from './item-ordem-compra.entity';

export enum StatusOrdemCompra {
  EM_ABERTO = 'em_aberto',
  RECEBIDA = 'recebida',
  CANCELADA = 'cancelada',
}

@Entity({ name: 'ordens_compra' })
export class OrdemCompra {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', unique: true })
  @Generated('increment')
  numero: number;

  @ManyToOne(() => Cliente)
  fornecedor: Cliente;

  @OneToMany(() => ItemOrdemCompra, (item) => item.ordemCompra, { cascade: true })
  itens: ItemOrdemCompra[];

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  valorTotal: number;

  @Column({ type: 'enum', enum: StatusOrdemCompra, default: StatusOrdemCompra.EM_ABERTO })
  status: StatusOrdemCompra;

  @CreateDateColumn()
  dataCompra: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
