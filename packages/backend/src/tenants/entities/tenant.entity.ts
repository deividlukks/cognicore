// ==============================================================================
// Entidade - Tenant
// Autor: Deivid Lucas
// Versão: 1.2
// Descrição: Adicionado o campo 'isMaster' para identificar o tenant principal
//            da plataforma CogniCore.
// ==============================================================================
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ schema: 'public', name: 'tenants' })
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  subdomain: string;

  // Novo campo para identificar o tenant da equipe CogniCore
  @Column({ default: false })
  isMaster: boolean;

  @OneToMany(() => User, (user) => user.tenant)
  users: User[];
}