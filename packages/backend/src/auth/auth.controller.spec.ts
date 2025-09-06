// ==============================================================================
// Teste Unitário - AuthController (com Pré-Login)
// Autor: Deivid Lucas
// Versão: 1.1
// Descrição: Testes unitários para o AuthController, cobrindo os
//            endpoints para o fluxo de login em duas fases.
// ==============================================================================
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { PreLoginDto } from './dto/pre-login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  const mockAuthService = {
    login: jest.fn(),
    preLoginValidate: jest.fn(), // Adicionar o mock para o novo método
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- NOVO TESTE ---
  describe('preLogin', () => {
    it('should call authService.preLoginValidate with the correct email', () => {
      const dto: PreLoginDto = { email: 'test@test.com' };
      controller.preLogin(dto);
      expect(mockAuthService.preLoginValidate).toHaveBeenCalledWith('test@test.com');
    });
  });

  // --- Teste existente ---
  describe('login', () => {
    it('should call authService.login with the user from request', () => {
      const user = { email: 'test@test.com' };
      const req = { user };
      const dto = new LoginDto();
      controller.login(req, dto);
      expect(mockAuthService.login).toHaveBeenCalledWith(user);
    });
  });
});
