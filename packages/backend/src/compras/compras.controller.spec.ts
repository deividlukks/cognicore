// ==============================================================================
// Teste Unitário - ComprasController (Completo)
// Autor: Deivid Lucas
// Versão: 1.1
// Descrição: Testes unitários para o ComprasController, cobrindo todos
//            os endpoints de criação, listagem, consulta e cancelamento.
// ==============================================================================
import { Test, TestingModule } from '@nestjs/testing';
import { ComprasController } from './compras.controller';
import { ComprasService } from './compras.service';
import { CreateOrdemCompraDto } from './dto/create-ordem-compra.dto';

// Mock do serviço
const mockComprasService = {
  createOrdemCompra: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  cancelarOrdemCompra: jest.fn(),
};

describe('ComprasController', () => {
  let controller: ComprasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComprasController],
      providers: [
        {
          provide: ComprasService,
          useValue: mockComprasService,
        },
      ],
    }).compile();

    controller = module.get<ComprasController>(ComprasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call comprasService.createOrdemCompra with correct data', () => {
      const dto: CreateOrdemCompraDto = { fornecedorId: 'uuid-fornecedor', itens: [] };
      controller.create(dto);
      expect(mockComprasService.createOrdemCompra).toHaveBeenCalledWith(dto);
    });
  });

  // --- NOVOS TESTES ---
  describe('findAll', () => {
    it('should call comprasService.findAll', () => {
      controller.findAll();
      expect(mockComprasService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call comprasService.findOne with the correct id', () => {
      const id = 'some-uuid';
      controller.findOne(id);
      expect(mockComprasService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('cancelar', () => {
    it('should call comprasService.cancelarOrdemCompra with the correct id', () => {
      const id = 'some-uuid';
      controller.cancelar(id);
      expect(mockComprasService.cancelarOrdemCompra).toHaveBeenCalledWith(id);
    });
  });
});
