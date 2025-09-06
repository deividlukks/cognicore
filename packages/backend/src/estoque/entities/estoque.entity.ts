// ==============================================================================
// Entidade - Estoque
// Autor: Deivid Lucas
// Versão: 1.1
// Descrição: Representa a quantidade de um produto em um local específico,
//            agora com relação para o histórico de movimentações.
// ==============================================================================
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Produto } from './produto.entity';
import { Local } from './local.entity';
import { MovimentoEstoque } from './movimento-estoque.entity'; // 1. Importar

@Entity({ name: 'estoques' })
export class Estoque {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Produto, (produto) => produto.estoques)
  produto: Produto;

  @ManyToOne(() => Local, (local) => local.estoques)
  local: Local;

  // Este campo agora representa o saldo ATUAL e será atualizado por transações.
  @Column({ type: 'int', default: 0 })
  quantidade: number;

  @Column({ type: 'int', nullable: true })
  estoqueMinimo: number;

  @Column({ type: 'int', nullable: true })
  estoqueMaximo: number;

  @Column({ type: 'int', nullable: true }) // Em dias
  crossdocking: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precoCompraUnitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  custoCompraUnitario: number;

  // 2. Adicionar a relação
  @OneToMany(() => MovimentoEstoque, (movimento) => movimento.estoque, { cascade: true })
  movimentos: MovimentoEstoque[];
}
