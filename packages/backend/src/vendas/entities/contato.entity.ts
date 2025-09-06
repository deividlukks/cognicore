// ==============================================================================
// Entidade - Contato
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: Representa os contatos associados a um cliente ou fornecedor.
// ==============================================================================
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cliente } from './cliente.entity';

@Entity({ name: 'contatos' })
export class Contato {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefone: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  celular: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @ManyToOne(() => Cliente, (cliente) => cliente.pessoasDeContato)
  cliente: Cliente;
}
