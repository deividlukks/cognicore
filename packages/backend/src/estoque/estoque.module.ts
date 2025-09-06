// ==============================================================================
// Módulo - EstoqueModule (Corrigido)
// Autor: Deivid Lucas
// Versão: 2.7
// Descrição: Módulo de Estoque que agora importa o TenantModule para resolver
//            as suas dependências de repositório.
// ==============================================================================
import { Module } from '@nestjs/common';
import { EstoqueService } from './estoque.service';
import { EstoqueController } from './estoque.controller';
import { TenantModule } from '../tenant/tenant.module';

@Module({
  imports: [TenantModule], // Adicionado para dar acesso aos repositórios partilhados
  controllers: [EstoqueController],
  providers: [EstoqueService],
  exports: [EstoqueService], // Exporta o serviço para ser usado por outros módulos
})
export class EstoqueModule {}
