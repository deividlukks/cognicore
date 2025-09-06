// ==============================================================================
// Teste Unitário - ComprasService (Completo)
// Autor: Deivid Lucas
// Versão: 1.1
// Descrição: Testes unitários para o ComprasService, cobrindo a lógica de
//            criação, listagem, consulta e cancelamento de Ordens de Compra.
// ==============================================================================
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ComprasService } from './compras.service';
import { Cliente, TipoCadastro } from '../vendas/entities/cliente.entity';
import { OrdemCompra, StatusOrdemCompra } from './entities/ordem-compra.entity';
import { Produto } from '../estoque/entities/produto.entity';
import { Local } from '../estoque/entities/local.entity';
import { EstoqueService } from '../estoque/estoque.service';
import { CreateOrdemCompraDto } from './dto/create-ordem-compra.dto';

// Mocks para todas as dependências
const mockFornecedorRepository = { findOneBy: jest.fn() };
const mockOrdemCompraRepository = { create: jest.fn(), find: jest.fn(), findOne: jest.fn() };
const mockProdutoRepository = { findOneBy: jest.fn() };
const mockLocalRepository = { findOneBy: jest.fn() };
const mockEstoqueService = { movimentarEstoque: jest.fn() };
const mockQueryRunner = {
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
  manager: { save: jest.fn() },
};
const mockTenantConnection = { createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner) };

describe('ComprasService', () => {
  let service: ComprasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComprasService,
        { provide: 'TENANT_CONNECTION', useValue: mockTenantConnection },
        { provide: 'CLIENTE_REPOSITORY', useValue: mockFornecedorRepository },
        { provide: 'ORDEM_COMPRA_REPOSITORY', useValue: mockOrdemCompraRepository },
        { provide: 'PRODUTO_REPOSITORY', useValue: mockProdutoRepository },
        { provide: 'LOCAL_REPOSITORY', useValue: mockLocalRepository },
        { provide: EstoqueService, useValue: mockEstoqueService },
      ],
    }).compile();

    service = module.get<ComprasService>(ComprasService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrdemCompra', () => {
    // Teste existente para criação
    it('should create a purchase order and increase stock successfully', async () => {
      const dto: CreateOrdemCompraDto = {
        fornecedorId: 'uuid-fornecedor',
        itens: [{ produtoId: 'uuid-produto', localId: 'uuid-local', quantidade: 10, custoUnitario: 20 }],
      };
      mockFornecedorRepository.findOneBy.mockResolvedValue({ id: 'uuid-fornecedor', tipoCadastro: TipoCadastro.FORNECEDOR });
      mockProdutoRepository.findOneBy.mockResolvedValue({ id: 'uuid-produto' });
      mockLocalRepository.findOneBy.mockResolvedValue({ id: 'uuid-local' });
      mockOrdemCompraRepository.create.mockImplementation(ordem => ordem);
      mockQueryRunner.manager.save.mockImplementation(ordem => Promise.resolve({ ...ordem, numero: 1, itens: ordem.itens }));

      await service.createOrdemCompra(dto);

      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockEstoqueService.movimentarEstoque).toHaveBeenCalledWith(expect.objectContaining({ quantidade: 10 }));
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });
  });

  // --- NOVOS TESTES ---
  describe('findAll', () => {
    it('should return an array of purchase orders', async () => {
      const expectedResult = [new OrdemCompra()];
      mockOrdemCompraRepository.find.mockResolvedValue(expectedResult);
      const result = await service.findAll();
      expect(result).toBe(expectedResult);
      expect(mockOrdemCompraRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single purchase order', async () => {
      const expectedResult = new OrdemCompra();
      mockOrdemCompraRepository.findOne.mockResolvedValue(expectedResult);
      const result = await service.findOne('some-id');
      expect(result).toBe(expectedResult);
    });

    it('should throw NotFoundException if order is not found', async () => {
      mockOrdemCompraRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('not-found-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('cancelarOrdemCompra', () => {
    it('should cancel an order and reverse stock movement', async () => {
      const ordem = {
        id: 'some-id',
        status: StatusOrdemCompra.EM_ABERTO,
        numero: 123,
        itens: [{ produto: { id: 'prod-1' }, local: { id: 'loc-1' }, quantidade: 5 }],
      } as OrdemCompra;
      mockOrdemCompraRepository.findOne.mockResolvedValue(ordem);
      mockQueryRunner.manager.save.mockImplementation(o => Promise.resolve(o));

      await service.cancelarOrdemCompra('some-id');

      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockEstoqueService.movimentarEstoque).toHaveBeenCalledWith(expect.objectContaining({
        quantidade: -5, // Quantidade negativa para reverter a entrada
      }));
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(expect.objectContaining({
        status: StatusOrdemCompra.CANCELADA,
      }));
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('should throw BadRequestException if order is already cancelled', async () => {
      const ordem = { id: 'some-id', status: StatusOrdemCompra.CANCELADA } as OrdemCompra;
      mockOrdemCompraRepository.findOne.mockResolvedValue(ordem);

      await expect(service.cancelarOrdemCompra('some-id')).rejects.toThrow(BadRequestException);
    });
  });
});
