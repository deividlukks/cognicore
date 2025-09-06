// ==============================================================================
// Módulo - FinanceiroModule
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: Módulo para agrupar todas as funcionalidades Financeiras.
//            Importa o TenantModule para aceder aos repositórios necessários.
// ==============================================================================
import { Module } from '@nestjs/common';
import { FinanceiroService } from './financeiro.service';
import { FinanceiroController } from './financeiro.controller';
import { TenantModule } from '../tenant/tenant.module';

@Module({
  imports: [TenantModule],
  controllers: [FinanceiroController],
  providers: [FinanceiroService],
  exports: [FinanceiroService],
})
export class FinanceiroModule {}
