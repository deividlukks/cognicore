// ==============================================================================
// Módulo - VendasModule (Corrigido com forwardRef)
// Autor: Deivid Lucas
// Versão: 1.4
// Descrição: Módulo de Vendas que agora utiliza forwardRef para resolver
//            a dependência circular com o EstoqueModule.
// ==============================================================================
import { Module, forwardRef } from '@nestjs/common'; // 1. Importar forwardRef
import { VendasService } from './vendas.service';
import { VendasController } from './vendas.controller';
import { EstoqueModule } from '../estoque/estoque.module';
import { TenantModule } from '../tenant/tenant.module';

@Module({
  imports: [
    TenantModule,
    forwardRef(() => EstoqueModule), // 2. Usar forwardRef aqui
  ],
  controllers: [VendasController],
  providers: [VendasService],
  exports: [VendasService],
})
export class VendasModule {}
