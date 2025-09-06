// ==============================================================================
// Entidade - User
// Autor: Deivid Lucas
// Versão: 1.1
// Descrição: Corrigida a propriedade 'password' para ser obrigatória (não opcional),
//            garantindo a integridade dos dados e resolvendo erro de tipo.
// ==============================================================================
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { Role } from '../../auth/enums/role.enum';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false }) // Impede que a password seja retornada por padrão
  // Correção: Removido o '?' para tornar a password obrigatória
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.USER],
  })
  roles: Role[];

  @ManyToOne(() => Tenant, (tenant) => tenant.users)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}