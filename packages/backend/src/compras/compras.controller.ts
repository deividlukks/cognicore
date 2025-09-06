// ==============================================================================
// Controller de Compras (com Controlo de Acesso)
// Autor: Deivid Lucas
// Versão: 1.3
// Descrição: Controller para gerir as operações de compras, com nomes de
//            métodos corrigidos para corresponder ao serviço.
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
import { ComprasService } from './compras.service';
import { CreateOrdemCompraDto } from './dto/create-ordem-compra.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('compras')
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) {}

  @Post()
  @Roles(Role.ADMIN, Role.COMPRADOR)
  create(@Body() createOrdemCompraDto: CreateOrdemCompraDto) {
    // Correção: Chamar o método correto 'createOrdemCompra'
    return this.comprasService.createOrdemCompra(createOrdemCompraDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.COMPRADOR, Role.FINANCEIRO)
  findAll() {
    return this.comprasService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.COMPRADOR, Role.FINANCEIRO)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.comprasService.findOne(id);
  }

  @Patch(':id/cancelar')
  @Roles(Role.ADMIN, Role.COMPRADOR)
  cancelar(@Param('id', ParseUUIDPipe) id: string) {
    // Correção: Chamar o método correto 'cancelarOrdemCompra'
    return this.comprasService.cancelarOrdemCompra(id);
  }
}

