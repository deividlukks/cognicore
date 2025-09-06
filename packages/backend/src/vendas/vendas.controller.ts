// ==============================================================================
// Controller de Vendas (com Controlo de Acesso)
// Autor: Deivid Lucas
// Versão: 1.3
// Descrição: Controller para gerir as operações de vendas, agora protegido
//            com o decorador @Roles para garantir a autorização.
// ==============================================================================

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { VendasService } from './vendas.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { CreateOrdemVendaDto } from './dto/create-ordem-venda.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('vendas')
export class VendasController {
  constructor(private readonly vendasService: VendasService) {}

  // Apenas ADMINS podem criar novos clientes/fornecedores
  @Post('clientes')
  @Roles(Role.ADMIN)
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.vendasService.create(createClienteDto);
  }

  // Todos os utilizadores autenticados podem ver a lista de clientes
  @Get('clientes')
  findAll() {
    return this.vendasService.findAll();
  }

  // Apenas VENDEDORES e ADMINS podem criar uma ordem de venda
  @Post('ordens')
  @Roles(Role.ADMIN, Role.VENDEDOR)
  createOrdemVenda(@Body() createOrdemVendaDto: CreateOrdemVendaDto) {
    return this.vendasService.createOrdemVenda(createOrdemVendaDto);
  }

  // Apenas VENDEDORES e ADMINS podem cancelar uma ordem de venda
  @Patch('ordens/:id/cancelar')
  @Roles(Role.ADMIN, Role.VENDEDOR)
  cancelarOrdemVenda(@Param('id', ParseUUIDPipe) id: string) {
    return this.vendasService.cancelarOrdemVenda(id);
  }
}
