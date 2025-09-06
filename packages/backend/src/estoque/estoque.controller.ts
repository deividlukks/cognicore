// ==============================================================================
// Controller de Estoque (com Controlo de Acesso)
// Autor: Deivid Lucas
// Versão: 1.2
// Descrição: Controller para gerir as operações de estoque, agora protegido
//            com o decorador @Roles para garantir a autorização.
// ==============================================================================

import { Controller, Post, Body, Get } from '@nestjs/common';
import { EstoqueService } from './estoque.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { CreateLocalDto } from './dto/create-local.dto';
import { MovimentarEstoqueDto } from './dto/movimentar-estoque.dto';
import { AjustarInventarioDto } from './dto/ajustar-inventario.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('estoque')
export class EstoqueController {
  constructor(private readonly estoqueService: EstoqueService) {}

  @Post('produtos')
  @Roles(Role.ADMIN, Role.GESTOR_ESTOQUE)
  createProduto(@Body() createProdutoDto: CreateProdutoDto) {
    return this.estoqueService.createProduto(createProdutoDto);
  }

  @Get('produtos')
  @Roles(Role.ADMIN, Role.GESTOR_ESTOQUE, Role.VENDEDOR, Role.COMPRADOR)
  findAllProdutos() {
    return this.estoqueService.findAllProdutos();
  }

  @Post('locais')
  @Roles(Role.ADMIN, Role.GESTOR_ESTOQUE)
  createLocal(@Body() createLocalDto: CreateLocalDto) {
    return this.estoqueService.createLocal(createLocalDto);
  }

  @Get('locais')
  @Roles(Role.ADMIN, Role.GESTOR_ESTOQUE, Role.VENDEDOR, Role.COMPRADOR)
  findAllLocais() {
    return this.estoqueService.findAllLocais();
  }

  @Post('movimentar')
  @Roles(Role.ADMIN, Role.GESTOR_ESTOQUE)
  movimentarEstoque(@Body() movimentarEstoqueDto: MovimentarEstoqueDto) {
    return this.estoqueService.movimentarEstoque(movimentarEstoqueDto);
  }

  @Post('inventario')
  @Roles(Role.ADMIN, Role.GESTOR_ESTOQUE)
  ajustarInventario(@Body() ajustarInventarioDto: AjustarInventarioDto) {
    return this.estoqueService.ajustarInventario(ajustarInventarioDto);
  }
}
