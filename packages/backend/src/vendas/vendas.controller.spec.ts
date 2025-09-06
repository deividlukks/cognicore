// ==============================================================================
// Teste Unitário - VendasController
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: Testes unitários para o VendasController.
// ==============================================================================
import { Test, TestingModule } from '@nestjs/testing';
import { VendasController } from './vendas.controller';
import { VendasService } from './vendas.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { TipoCadastro, TipoPessoa, TipoContribuinte } from './entities/cliente.entity';

// Mock do serviço
const mockVendasService = {
  create: jest.fn(),
  findAll: jest.fn(),
};

describe('VendasController', () => {
  let controller: VendasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendasController],
      providers: [
        {
          provide: VendasService,
          useValue: mockVendasService,
        },
      ],
    }).compile();

    controller = module.get<VendasController>(VendasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call vendasService.create with correct data', () => {
      const dto: CreateClienteDto = {
        tipoCadastro: TipoCadastro.CLIENTE,
        tipoPessoa: TipoPessoa.FISICA,
        nomeCompleto: 'João da Silva',
        cpf: '123.456.789-00',
        contribuinte: TipoContribuinte.NAO_CONTRIBUINTE,
      };
      controller.create(dto);
      expect(mockVendasService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call vendasService.findAll', () => {
      controller.findAll();
      expect(mockVendasService.findAll).toHaveBeenCalled();
    });
  });
});
