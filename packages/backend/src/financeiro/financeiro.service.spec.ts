// ==============================================================================
// Teste Unitário - FinanceiroService (Completo)
// Autor: Deivid Lucas
// Versão: 1.3
// Descrição: Testes unitários para o FinanceiroService, cobrindo a lógica de
//            criação, listagem, pagamento e recebimento de contas.
// ==============================================================================
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { FinanceiroService } from './financeiro.service';
import { ContaPagar, StatusContaPagar } from './entities/conta-pagar.entity';
import { ContaReceber, StatusContaReceber } from './entities/conta-receber.entity';
import { Cliente, TipoCadastro } from '../vendas/entities/cliente.entity';
import { CreateContaPagarDto } from './dto/create-conta-pagar.dto';
import { CreateContaReceberDto } from './dto/create-conta-receber.dto';
import { PagarContaDto } from './dto/pagar-conta.dto';
import { ReceberContaDto } from './dto/receber-conta.dto';
import { Lancamento } from './entities/lancamento.entity';

// Mocks para as dependências
const mockContaPagarRepository = { create: jest.fn(), save: jest.fn(), find: jest.fn() };
const mockContaReceberRepository = { create: jest.fn(), save: jest.fn(), find: jest.fn() };
const mockClienteRepository = { findOneBy: jest.fn() };
const mockQueryRunner = {
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
  manager: { findOne: jest.fn(), findOneBy: jest.fn(), create: jest.fn(), save: jest.fn() },
};
const mockTenantConnection = { createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner) };

describe('FinanceiroService', () => {
  let service: FinanceiroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinanceiroService,
        { provide: 'TENANT_CONNECTION', useValue: mockTenantConnection },
        { provide: 'CONTA_PAGAR_REPOSITORY', useValue: mockContaPagarRepository },
        { provide: 'CONTA_RECEBER_REPOSITORY', useValue: mockContaReceberRepository },
        { provide: 'CLIENTE_REPOSITORY', useValue: mockClienteRepository },
        { provide: 'CONTA_FINANCEIRA_REPOSITORY', useValue: {} },
        { provide: 'LANCAMENTO_REPOSITORY', useValue: {} },
      ],
    }).compile();

    service = module.get<FinanceiroService>(FinanceiroService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Testes para Contas a Receber ---
  describe('createContaReceber', () => {
    it('should create a new bill to receive successfully', async () => {
      const dto: CreateContaReceberDto = {
        clienteId: 'uuid-cliente',
        valor: 200,
        dataEmissao: new Date(),
        dataCompetencia: new Date(),
        dataVencimento: new Date(),
      };
      const cliente = { id: 'uuid-cliente', tipoCadastro: TipoCadastro.CLIENTE };
      mockClienteRepository.findOneBy.mockResolvedValue(cliente);
      mockContaReceberRepository.create.mockImplementation(conta => conta);
      mockContaReceberRepository.save.mockResolvedValue({ id: 'uuid-conta', ...dto, cliente });

      await service.createContaReceber(dto);

      expect(mockClienteRepository.findOneBy).toHaveBeenCalledWith({ id: dto.clienteId });
      expect(mockContaReceberRepository.create).toHaveBeenCalled();
      expect(mockContaReceberRepository.save).toHaveBeenCalled();
    });
  });

  describe('receberConta', () => {
    it('should receive a bill and create an entry launch successfully', async () => {
      const contaId = 'uuid-conta-a-receber';
      const dto: ReceberContaDto = {
        contaFinanceiraId: 'uuid-conta-financeira',
        dataRecebimento: new Date(),
        formaPagamento: 'Depósito',
      };
      const contaAReceber = {
        id: contaId,
        status: StatusContaReceber.ABERTA,
        valor: 500,
        numeroDocumento: 456,
        cliente: { id: 'uuid-cliente' },
      } as ContaReceber;

      mockQueryRunner.manager.findOne.mockResolvedValue(contaAReceber);
      const createLancamentoSpy = jest.spyOn(service, 'createLancamento').mockResolvedValue(new Lancamento());
      mockQueryRunner.manager.save.mockImplementation(conta => Promise.resolve(conta));

      await service.receberConta(contaId, dto);

      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(createLancamentoSpy).toHaveBeenCalled();
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: StatusContaReceber.RECEBIDA,
        }),
      );
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });
  });

  // --- Testes para Contas a Pagar ---
  describe('createContaPagar', () => {
    it('should create a new bill to pay successfully', async () => {
      const dto: CreateContaPagarDto = {
        fornecedorId: 'uuid-fornecedor',
        valor: 100,
        dataEmissao: new Date(),
        dataCompetencia: new Date(),
        dataVencimento: new Date(),
        historico: 'Pagamento de fornecedor',
      };
      const fornecedor = { id: 'uuid-fornecedor', tipoCadastro: TipoCadastro.FORNECEDOR };
      mockClienteRepository.findOneBy.mockResolvedValue(fornecedor);
      mockContaPagarRepository.create.mockImplementation(conta => conta);
      mockContaPagarRepository.save.mockResolvedValue({ id: 'uuid-conta', ...dto, fornecedor });

      await service.createContaPagar(dto);

      expect(mockClienteRepository.findOneBy).toHaveBeenCalledWith({ id: dto.fornecedorId });
      expect(mockContaPagarRepository.create).toHaveBeenCalled();
      expect(mockContaPagarRepository.save).toHaveBeenCalled();
    });
  });

  describe('pagarConta', () => {
    it('should pay a bill and create a launch successfully', async () => {
      const contaId = 'uuid-conta-a-pagar';
      const dto: PagarContaDto = {
        contaFinanceiraId: 'uuid-conta-financeira',
        dataPagamento: new Date(),
        formaPagamento: 'Transferência',
      };
      const contaAPagar = {
        id: contaId,
        status: StatusContaPagar.ABERTA,
        valor: 100,
        historico: 'Teste',
        fornecedor: { id: 'uuid-fornecedor' },
      } as ContaPagar;

      mockQueryRunner.manager.findOne.mockResolvedValue(contaAPagar);
      const createLancamentoSpy = jest.spyOn(service, 'createLancamento').mockResolvedValue(new Lancamento());
      mockQueryRunner.manager.save.mockImplementation(conta => Promise.resolve(conta));

      await service.pagarConta(contaId, dto);

      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(createLancamentoSpy).toHaveBeenCalled();
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: StatusContaPagar.PAGA,
        }),
      );
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });
  });
});
