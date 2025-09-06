// ==============================================================================
// Controller Financeiro (com Controlo de Acesso)
// Autor: Deivid Lucas
// Versão: 1.2
// Descrição: Controller para gerir as operações financeiras, agora protegido
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
import { FinanceiroService } from './financeiro.service';
import { CreateContaFinanceiraDto } from './dto/create-conta-financeira.dto';
import { CreateLancamentoDto } from './dto/create-lancamento.dto';
import { CreateContaPagarDto } from './dto/create-conta-pagar.dto';
import { CreateContaReceberDto } from './dto/create-conta-receber.dto';
import { PagarContaDto } from './dto/pagar-conta.dto';
import { ReceberContaDto } from './dto/receber-conta.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('financeiro')
@Roles(Role.ADMIN, Role.FINANCEIRO) // Protege todas as rotas deste controller
export class FinanceiroController {
  constructor(private readonly financeiroService: FinanceiroService) {}

  // Contas Financeiras
  @Post('contas-financeiras')
  createContaFinanceira(@Body() dto: CreateContaFinanceiraDto) {
    return this.financeiroService.createContaFinanceira(dto);
  }

  @Get('contas-financeiras')
  findAllContasFinanceiras() {
    return this.financeiroService.findAllContasFinanceiras();
  }

  // Lançamentos
  @Post('lancamentos')
  createLancamento(@Body() dto: CreateLancamentoDto) {
    return this.financeiroService.createLancamento(dto);
  }

  // Contas a Pagar
  @Post('contas-pagar')
  createContaPagar(@Body() dto: CreateContaPagarDto) {
    return this.financeiroService.createContaPagar(dto);
  }

  @Get('contas-pagar')
  findAllContasPagar() {
    return this.financeiroService.findAllContasPagar();
  }

  @Patch('contas-pagar/:id/pagar')
  pagarConta(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: PagarContaDto,
  ) {
    return this.financeiroService.pagarConta(id, dto);
  }

  // Contas a Receber
  @Post('contas-receber')
  createContaReceber(@Body() dto: CreateContaReceberDto) {
    return this.financeiroService.createContaReceber(dto);
  }

  @Get('contas-receber')
  findAllContasReceber() {
    return this.financeiroService.findAllContasReceber();
  }

  @Patch('contas-receber/:id/receber')
  receberConta(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ReceberContaDto,
  ) {
    return this.financeiroService.receberConta(id, dto);
  }
}
