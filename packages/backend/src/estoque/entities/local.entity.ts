// ==============================================================================
// Entidade - Local
// Autor: Deivid Lucas
// Versão: 1.2
// Descrição: Representa os locais de armazenamento de estoque. Agora inclui
//            um campo 'codigo' para fácil identificação.
// ==============================================================================

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Estoque } from './estoque.entity';

@Entity({ name: 'locais' })
export class Local {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  codigo: string; // Ex: "100", "DEP-01"

  @Column({ type: 'varchar', length: 255, unique: true })
  nome: string; // Ex: "Depósito Principal", "Loja Física", "Avarias"

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @OneToMany(() => Estoque, (estoque) => estoque.local)
  estoques: Estoque[];

  @CreateDateColumn()
  createdAt: Date;
}
