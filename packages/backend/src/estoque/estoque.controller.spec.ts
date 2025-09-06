// ==============================================================================
// Teste Unitário - EstoqueController (Completo)
// Autor: Deivid Lucas
// Versão: 1.3
// Descrição: Versão completa dos testes unitários para o EstoqueController,
//            incluindo todos os endpoints.
// ==============================================================================

import { Test, TestingModule } from '@nestjs/testing';
import { EstoqueController } from './estoque.controller';
import { EstoqueService } from './estoque.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { MovimentarEstoqueDto } from './dto/movimentar-estoque.dto';
import { TipoMovimento } from './entities/movimento-estoque.entity';
import { AjustarInventarioDto } from './dto/ajustar-inventario.dto';
import { CreateLocalDto } from './dto/create-local.dto';

// Mock do serviço com todos os métodos necessários
const mockEstoqueService = {
  createProduto: jest.fn(),
  findAllProdutos: jest.fn(),
  createLocal: jest.fn(),
  findAllLocais: jest.fn(),
  movimentarEstoque: jest.fn(),
  ajustarInventario: jest.fn(),
};

describe('EstoqueController', () => {
  let controller: EstoqueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstoqueController],
      providers: [
        {
          provide: EstoqueService,
          useValue: mockEstoqueService,
        },
      ],
    }).compile();

    controller = module.get<EstoqueController>(EstoqueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- Teste do Endpoint de Inventário ---
  describe('ajustarInventario', () => {
    it('should call estoqueService.ajustarInventario with correct data', () => {
      const dto: AjustarInventarioDto = {
        produtoId: 'uuid-produto',
        localId: 'uuid-local',
        quantidadeContada: 100,
      };
      controller.ajustarInventario(dto);
      expect(mockEstoqueService.ajustarInventario).toHaveBeenCalledWith(dto);
    });
  });

  // --- Teste do Endpoint de Movimentação ---
  describe('movimentarEstoque', () => {
    it('should call estoqueService.movimentarEstoque with correct data', () => {
      const dto: MovimentarEstoqueDto = {
        produtoId: 'uuid-produto',
        localId: 'uuid-local',
        quantidade: 10,
        tipo: TipoMovimento.ENTRADA_RECEBIMENTO,
      };
      controller.movimentarEstoque(dto);
      expect(mockEstoqueService.movimentarEstoque).toHaveBeenCalledWith(dto);
    });
  });

  // --- Testes dos Endpoints de Produto ---
  describe('createProduto', () => {
    it('should call estoqueService.createProduto with correct data', () => {
      const dto: CreateProdutoDto = {
        descricao: 'Produto Teste',
        precoVenda: 20,
      };
      controller.createProduto(dto);
      expect(mockEstoqueService.createProduto).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAllProdutos', () => {
    it('should call estoqueService.findAllProdutos', () => {
      controller.findAllProdutos();
      expect(mockEstoqueService.findAllProdutos).toHaveBeenCalled();
    });
  });

  // --- Testes dos Endpoints de Local ---
  describe('createLocal', () => {
    it('should call estoqueService.createLocal with correct data', () => {
      const dto: CreateLocalDto = {
        codigo: 'DEP-01',
        nome: 'Depósito Teste',
      };
      controller.createLocal(dto);
      expect(mockEstoqueService.createLocal).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAllLocais', () => {
    it('should call estoqueService.findAllLocais', () => {
      controller.findAllLocais();
      expect(mockEstoqueService.findAllLocais).toHaveBeenCalled();
    });
  });
});
