// ==============================================================================
// Entidade - ItemOrdemCompra
// Autor: Deivid Lucas
// Versão: 1.1
// Descrição: Representa uma linha de produto dentro de uma Ordem de Compra,
//            agora incluindo a referência ao Local de destino do estoque.
// ==============================================================================
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { OrdemCompra } from './ordem-compra.entity';
import { Produto } from '../../estoque/entities/produto.entity';
import { Local } from '../../estoque/entities/local.entity'; // 1. Importar Local

@Entity({ name: 'itens_ordem_compra' })
export class ItemOrdemCompra {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OrdemCompra, (ordem) => ordem.itens)
  ordemCompra: OrdemCompra;

  @ManyToOne(() => Produto)
  produto: Produto;

  // 2. Adicionar a relação com o Local
  @ManyToOne(() => Local)
  local: Local;

  @Column({ type: 'int' })
  quantidade: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  custoUnitario: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  custoTotal: number;
}
