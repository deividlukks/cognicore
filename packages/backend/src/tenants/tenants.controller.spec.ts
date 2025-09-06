// ==============================================================================
// Teste Unitário - TenantsController
// Autor: Deivid Lucas
// Versão: 1.1
// Descrição: Testes unitários para o TenantsController. Garante que o controller
//            chama corretamente o serviço correspondente.
// ==============================================================================

import { Test, TestingModule } from '@nestjs/testing';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';

// 1. Criamos um "dublê" (mock) do TenantsService.
//    Ele tem os mesmos métodos que o serviço real, mas podemos controlar
//    o que eles fazem durante o teste.
const mockTenantsService = {
  create: jest.fn(dto => {
    return {
      id: 'some-uuid',
      ...dto,
    };
  }),
};

describe('TenantsController', () => {
  let controller: TenantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantsController],
      providers: [
        // 2. Aqui está a correção: informamos ao módulo de teste para usar
        //    nosso dublê sempre que alguém pedir pelo TenantsService.
        {
          provide: TenantsService,
          useValue: mockTenantsService,
        },
      ],
    }).compile();

    controller = module.get<TenantsController>(TenantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Adicionamos um teste para o método 'create' do controller
  describe('create', () => {
    it('should call tenantsService.create with the correct data', () => {
      const dto: CreateTenantDto = {
        name: 'Empresa Teste Controller',
        subdomain: 'empresa-teste-controller',
      };

      // Chamamos o método do controller
      controller.create(dto);

      // Verificamos se o método 'create' do nosso serviço dublê foi chamado
      // e se foi chamado com os dados corretos (o 'dto').
      expect(mockTenantsService.create).toHaveBeenCalledWith(dto);
    });
  });
});
