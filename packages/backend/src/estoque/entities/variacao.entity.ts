// ==============================================================================
// Entidade - Variacao
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: Representa as variações de um produto (ex: Cor, Tamanho).
// ==============================================================================
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Produto } from './produto.entity';

@Entity({ name: 'variacoes' })
export class Variacao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nomeAtributo: string; // Ex: "Cor"

  @Column()
  opcao: string; // Ex: "Azul"

  @ManyToOne(() => Produto, (produto) => produto.variacoes)
  produto: Produto;
}
