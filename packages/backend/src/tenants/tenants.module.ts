// ==============================================================================
// Módulo - TenantsModule
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: Módulo responsável por agrupar toda a lógica relacionada à
//            gestão de tenants (empresas) no sistema.
// ==============================================================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantsService } from './tenants.service';
import { Tenant } from './entities/tenant.entity';
import { TenantsController } from './tenants.controller';

@Module({
  // Importa o TypeOrmModule, especificando que a entidade 'Tenant'
  // pertence a este módulo. Isso permite injetar o repositório do Tenant
  // em outros serviços, como o TenantsService.
  imports: [TypeOrmModule.forFeature([Tenant])],
  providers: [TenantsService],
  exports: [TenantsService],
  controllers: [TenantsController], // Exporta o serviço para ser usado em outros módulos
})
export class TenantsModule {}
