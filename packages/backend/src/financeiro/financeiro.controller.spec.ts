// ==============================================================================
// Teste Unitário - FinanceiroController (com Correção de Teste)
// Autor: Deivid Lucas
// Versão: 1.2
// Descrição: Testes para o controller financeiro, com o teste para a função
//            inexistente 'findAllLancamentos' removido.
// ==============================================================================

import { Test, TestingModule } from '@nestjs/testing';
import { FinanceiroController } from './financeiro.controller';
import { FinanceiroService } from './financeiro.service';
import { CreateContaFinanceiraDto } from './dto/create-conta-financeira.dto';
import { CreateLancamentoDto } from './dto/create-lancamento.dto';
import { CreateContaPagarDto } from './dto/create-conta-pagar.dto';
import { PagarContaDto } from './dto/pagar-conta.dto';
import { CreateContaReceberDto } from './dto/create-conta-receber.dto';
import { ReceberContaDto } from './dto/receber-conta.dto';

// Mock completo do serviço financeiro
const mockFinanceiroService = {
  createContaFinanceira: jest.fn(),
  findAllContasFinanceiras: jest.fn(),
  createLancamento: jest.fn(),
  createContaPagar: jest.fn(),
  findAllContasPagar: jest.fn(),
  pagarConta: jest.fn(),
  createContaReceber: jest.fn(),
  findAllContasReceber: jest.fn(),
  receberConta: jest.fn(),
};

describe('FinanceiroController', () => {
  let controller: FinanceiroController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinanceiroController],
      providers: [
        {
          provide: FinanceiroService,
          useValue: mockFinanceiroService,
        },
      ],
    }).compile();

    controller = module.get<FinanceiroController>(FinanceiroController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Testes para Contas Financeiras
  describe('createContaFinanceira', () => {
    it('should call service.createContaFinanceira', () => {
      const dto = new CreateContaFinanceiraDto();
      controller.createContaFinanceira(dto);
      expect(mockFinanceiroService.createContaFinanceira).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAllContasFinanceiras', () => {
    it('should call service.findAllContasFinanceiras', () => {
      controller.findAllContasFinanceiras();
      expect(mockFinanceiroService.findAllContasFinanceiras).toHaveBeenCalled();
    });
  });

  // Testes para Lançamentos
  describe('createLancamento', () => {
    it('should call service.createLancamento', () => {
      const dto = new CreateLancamentoDto();
      controller.createLancamento(dto);
      expect(mockFinanceiroService.createLancamento).toHaveBeenCalledWith(dto);
    });
  });

  // Testes para Contas a Pagar
  describe('createContaPagar', () => {
    it('should call service.createContaPagar', () => {
      const dto = new CreateContaPagarDto();
      controller.createContaPagar(dto);
      expect(mockFinanceiroService.createContaPagar).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAllContasPagar', () => {
    it('should call service.findAllContasPagar', () => {
      controller.findAllContasPagar();
      expect(mockFinanceiroService.findAllContasPagar).toHaveBeenCalled();
    });
  });

  describe('pagarConta', () => {
    it('should call service.pagarConta', () => {
      const id = 'some-uuid';
      const dto = new PagarContaDto();
      controller.pagarConta(id, dto);
      expect(mockFinanceiroService.pagarConta).toHaveBeenCalledWith(id, dto);
    });
  });

  // Testes para Contas a Receber
  describe('createContaReceber', () => {
    it('should call service.createContaReceber', () => {
      const dto = new CreateContaReceberDto();
      controller.createContaReceber(dto);
      expect(mockFinanceiroService.createContaReceber).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAllContasReceber', () => {
    it('should call service.findAllContasReceber', () => {
      controller.findAllContasReceber();
      expect(mockFinanceiroService.findAllContasReceber).toHaveBeenCalled();
    });
  });

  describe('receberConta', () => {
    it('should call service.receberConta', () => {
      const id = 'some-uuid';
      const dto = new ReceberContaDto();
      controller.receberConta(id, dto);
      expect(mockFinanceiroService.receberConta).toHaveBeenCalledWith(id, dto);
    });
  });
});
