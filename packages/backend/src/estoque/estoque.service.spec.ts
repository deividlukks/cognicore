// ==============================================================================
// Teste Unitário - EstoqueService (com Inventário)
// Autor: Deivid Lucas
// Versão: 1.3
// Descrição: Testes unitários para o EstoqueService, cobrindo a lógica
//            de negócio para o ajuste de inventário.
// ==============================================================================

import { Test, TestingModule } from '@nestjs/testing';
import { Repository, DataSource } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EstoqueService } from './estoque.service';
import { Produto } from './entities/produto.entity';
import { Local } from './entities/local.entity';
import { Estoque } from './entities/estoque.entity';
import { MovimentoEstoque, TipoMovimento } from './entities/movimento-estoque.entity';
import { MovimentarEstoqueDto } from './dto/movimentar-estoque.dto';
import { AjustarInventarioDto } from './dto/ajustar-inventario.dto';

// Mocks para repositórios e a conexão
const mockQueryRunner = {
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
  manager: {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  },
};
const mockTenantConnection = { createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner) };
const mockProdutoRepository = { create: jest.fn(), save: jest.fn() };
const mockLocalRepository = { findOneBy: jest.fn() };
const mockEstoqueRepository = { findOne: jest.fn() }; // Precisamos mockar o findOne aqui

describe('EstoqueService', () => {
  let service: EstoqueService;
  let estoqueRepository: Repository<Estoque>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstoqueService,
        { provide: 'TENANT_CONNECTION', useValue: mockTenantConnection },
        { provide: 'PRODUTO_REPOSITORY', useValue: mockProdutoRepository },
        { provide: 'LOCAL_REPOSITORY', useValue: mockLocalRepository },
        { provide: 'ESTOQUE_REPOSITORY', useValue: mockEstoqueRepository },
        { provide: 'TRIBUTACAO_REPOSITORY', useValue: {} },
        { provide: 'VARIACAO_REPOSITORY', useValue: {} },
        { provide: 'IMAGEM_PRODUTO_REPOSITORY', useValue: {} },
        { provide: 'MOVIMENTO_ESTOQUE_REPOSITORY', useValue: {} },
      ],
    }).compile();

    service = module.get<EstoqueService>(EstoqueService);
    estoqueRepository = module.get('ESTOQUE_REPOSITORY');
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- NOVOS TESTES PARA O INVENTÁRIO ---
  describe('ajustarInventario', () => {
    const dto: AjustarInventarioDto = {
      produtoId: 'uuid-produto',
      localId: 'uuid-local',
      quantidadeContada: 15,
    };

    // Espião para o método movimentarEstoque, para podermos verificar se ele é chamado
    let movimentarEstoqueSpy: jest.SpyInstance;

    beforeEach(() => {
      // Criamos um "espião" no método movimentarEstoque do nosso próprio serviço
      movimentarEstoqueSpy = jest.spyOn(service, 'movimentarEstoque').mockResolvedValue(new MovimentoEstoque());
    });

    it('should create a positive adjustment movement if counted quantity is higher', async () => {
      const estoqueSistema = { quantidade: 10 } as Estoque;
      mockEstoqueRepository.findOne.mockResolvedValue(estoqueSistema);

      await service.ajustarInventario(dto);

      expect(estoqueRepository.findOne).toHaveBeenCalledWith({ where: { produto: { id: dto.produtoId }, local: { id: dto.localId } } });
      expect(movimentarEstoqueSpy).toHaveBeenCalledWith(expect.objectContaining({
        quantidade: 5, // 15 (contado) - 10 (sistema) = 5 (diferença positiva)
        tipo: TipoMovimento.AJUSTE_INVENTARIO,
      }));
    });

    it('should create a negative adjustment movement if counted quantity is lower', async () => {
      const estoqueSistema = { quantidade: 20 } as Estoque;
      mockEstoqueRepository.findOne.mockResolvedValue(estoqueSistema);

      await service.ajustarInventario(dto);

      expect(movimentarEstoqueSpy).toHaveBeenCalledWith(expect.objectContaining({
        quantidade: -5, // 15 (contado) - 20 (sistema) = -5 (diferença negativa)
        tipo: TipoMovimento.AJUSTE_INVENTARIO,
      }));
    });

    it('should do nothing if counted quantity is the same as system quantity', async () => {
      const estoqueSistema = { quantidade: 15 } as Estoque;
      mockEstoqueRepository.findOne.mockResolvedValue(estoqueSistema);

      const result = await service.ajustarInventario(dto);

      expect(movimentarEstoqueSpy).not.toHaveBeenCalled();
      expect(result).toEqual({ message: 'Nenhum ajuste necessário. O saldo do sistema já corresponde à contagem.' });
    });
  });

  // Testes de movimentarEstoque e outros métodos continuam aqui...
});
