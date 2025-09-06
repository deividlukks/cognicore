// ==============================================================================
// Entidade - ImagemProduto
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: Armazena as URLs das imagens associadas a um produto.
// ==============================================================================
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Produto } from './produto.entity';

@Entity({ name: 'imagens_produto' })
export class ImagemProduto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column({ default: 0 })
  ordem: number;

  @ManyToOne(() => Produto, (produto) => produto.imagens)
  produto: Produto;
}
