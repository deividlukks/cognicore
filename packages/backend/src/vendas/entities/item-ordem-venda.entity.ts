// ==============================================================================
// Entidade - ItemOrdemVenda
// Autor: Deivid Lucas
// Versão: 1.1
// Descrição: Representa uma linha de produto dentro de uma Ordem de Venda,
//            agora incluindo a referência ao Local de origem do estoque.
// ==============================================================================
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { OrdemVenda } from './ordem-venda.entity';
import { Produto } from '../../estoque/entities/produto.entity';
import { Local } from '../../estoque/entities/local.entity'; // 1. Importar Local

@Entity({ name: 'itens_ordem_venda' })
export class ItemOrdemVenda {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OrdemVenda, (ordem) => ordem.itens)
  ordemVenda: OrdemVenda;

  @ManyToOne(() => Produto)
  produto: Produto;

  // 2. Adicionar a relação com o Local
  @ManyToOne(() => Local)
  local: Local;

  @Column({ type: 'int' })
  quantidade: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precoUnitario: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  precoTotal: number;
}
