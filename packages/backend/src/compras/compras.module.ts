// ==============================================================================
// Módulo - ComprasModule
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: Módulo para agrupar todas as funcionalidades de Compras.
//            Importa os módulos Tenant e Estoque para aceder aos
//            repositórios e serviços necessários.
// ==============================================================================
import { Module, forwardRef } from '@nestjs/common';
import { ComprasService } from './compras.service';
import { ComprasController } from './compras.controller';
import { TenantModule } from '../tenant/tenant.module';
import { EstoqueModule } from '../estoque/estoque.module';

@Module({
  imports: [
    TenantModule,
    forwardRef(() => EstoqueModule),
  ],
  controllers: [ComprasController],
  providers: [ComprasService],
  exports: [ComprasService],
})
export class ComprasModule {}
