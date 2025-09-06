// ==============================================================================
// Teste Unitário - VendasService (Refatorado e Corrigido)
// Autor: Deivid Lucas
// Versão: 1.2
// Descrição: Testes unitários para o VendasService, com todas as dependências
//            mockadas corretamente, incluindo o LOCAL_REPOSITORY.
// ==============================================================================
import { Test, TestingModule } from '@nestjs/testing';
import { Repository, DataSource } from 'typeorm';
import { BadRequestException, NotFoundException, forwardRef } from '@nestjs/common';
import { VendasService } from './vendas.service';
import { Cliente, TipoPessoa, TipoCadastro, TipoContribuinte } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { EstoqueService } from '../estoque/estoque.service';
import { CreateOrdemVendaDto } from './dto/create-ordem-venda.dto';
import { OrdemVenda } from './entities/ordem-venda.entity';
import { Produto } from '../estoque/entities/produto.entity';
import { Local } from '../estoque/entities/local.entity';

// Mocks para todas as dependências do VendasService
const mockClienteRepository = { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOneBy: jest.fn() };
const mockOrdemVendaRepository = { create: jest.fn() };
const mockProdutoRepository = { findOneBy: jest.fn() };
const mockLocalRepository = { findOneBy: jest.fn() }; // Mock para a nova dependência
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

describe('VendasService', () => {
  let service: VendasService;
  let repository: Repository<Cliente>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendasService,
        // Fornecer mocks para TODAS as dependências injetadas
        { provide: 'TENANT_CONNECTION', useValue: mockTenantConnection },
        { provide: 'CLIENTE_REPOSITORY', useValue: mockClienteRepository },
        { provide: 'ORDEM_VENDA_REPOSITORY', useValue: mockOrdemVendaRepository },
        { provide: 'PRODUTO_REPOSITORY', useValue: mockProdutoRepository },
        { provide: 'LOCAL_REPOSITORY', useValue: mockLocalRepository }, // Adicionar o mock aqui
        { provide: EstoqueService, useValue: mockEstoqueService },
      ],
    }).compile();

    service = module.get<VendasService>(VendasService);
    repository = module.get('CLIENTE_REPOSITORY');
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Testes para createOrdemVenda ---
  describe('createOrdemVenda', () => {
    it('should create an order and decrease stock successfully', async () => {
      const dto: CreateOrdemVendaDto = {
        clienteId: 'uuid-cliente',
        itens: [{ produtoId: 'uuid-produto', localId: 'uuid-local', quantidade: 2, precoUnitario: 50 }],
      };
      mockClienteRepository.findOneBy.mockResolvedValue({ id: 'uuid-cliente' });
      mockProdutoRepository.findOneBy.mockResolvedValue({ id: 'uuid-produto' });
      mockLocalRepository.findOneBy.mockResolvedValue({ id: 'uuid-local' }); // Simular a descoberta do local
      mockOrdemVendaRepository.create.mockImplementation(ordem => ordem);
      mockQueryRunner.manager.save.mockImplementation(ordem => Promise.resolve({ ...ordem, numero: 1 }));

      await service.createOrdemVenda(dto);

      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.manager.save).toHaveBeenCalled();
      expect(mockEstoqueService.movimentarEstoque).toHaveBeenCalledWith(expect.objectContaining({
        quantidade: -2,
      }));
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.rollbackTransaction).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if client does not exist', async () => {
        const dto: CreateOrdemVendaDto = { clienteId: 'uuid-invalido', itens: [] };
        mockClienteRepository.findOneBy.mockResolvedValue(null);
  
        await expect(service.createOrdemVenda(dto)).rejects.toThrow(NotFoundException);
        expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      });
  });

  // --- Testes de Cliente ---
  describe('create', () => {
    it('should create a new Pessoa Física successfully', async () => {
      const dto: CreateClienteDto = {
        tipoCadastro: TipoCadastro.CLIENTE,
        tipoPessoa: TipoPessoa.FISICA,
        nomeCompleto: 'João da Silva',
        cpf: '123.456.789-00',
        contribuinte: TipoContribuinte.NAO_CONTRIBUINTE,
      };
      mockClienteRepository.create.mockReturnValue(dto);
      mockClienteRepository.save.mockResolvedValue({ id: 'uuid', ...dto });

      await service.create(dto);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of clients', async () => {
      const result = [{ id: 'uuid', nomeCompleto: 'Cliente Teste' }];
      mockClienteRepository.find.mockResolvedValue(result);
      expect(await service.findAll()).toBe(result);
    });
  });
});
