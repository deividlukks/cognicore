// ==============================================================================
// Módulo - UsersModule
// Autor: Deivid Lucas
// Versão: 1.1
// Descrição: Módulo responsável por gerir a entidade User. Agora importa
//            a entidade Tenant para que o UsersService possa injetar
//            o seu repositório.
// ==============================================================================
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Tenant } from '../tenants/entities/tenant.entity'; // 1. Importar a entidade Tenant

@Module({
  // 2. Adicionar a entidade Tenant ao forFeature
  //    Isto torna o Repositório de Tenants disponível para injeção neste módulo.
  imports: [TypeOrmModule.forFeature([User, Tenant])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
