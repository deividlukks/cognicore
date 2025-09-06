// ==============================================================================
// Teste Unitário para RolesGuard
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: Testes para o guarda de autorização (RolesGuard), que valida
//            se um utilizador tem a permissão necessária para aceder a um endpoint.
// ==============================================================================

import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { ExecutionContext } from '@nestjs/common';
import { Role } from '../enums/role.enum';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  // Função auxiliar para criar um mock do ExecutionContext
  const createMockExecutionContext = (user: any): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          user,
        }),
      }),
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
    } as any;
  };

  it('should allow access if no roles are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    const context = createMockExecutionContext({ roles: [Role.USER] });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow access if user has the required role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);
    const context = createMockExecutionContext({ roles: [Role.ADMIN] });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should deny access if user does not have the required role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);
    const context = createMockExecutionContext({ roles: [Role.USER] });
    expect(guard.canActivate(context)).toBe(false);
  });

  it('should allow access if user has one of the required roles', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([Role.ADMIN, Role.VENDEDOR]);
    const context = createMockExecutionContext({ roles: [Role.USER, Role.VENDEDOR] });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should deny access if user has no roles', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);
    const context = createMockExecutionContext({ roles: [] }); // Utilizador sem funções
    expect(guard.canActivate(context)).toBe(false);
  });

  it('should deny access if user object is missing', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);
    const context = createMockExecutionContext(null); // Sem utilizador na requisição
    expect(guard.canActivate(context)).toBe(false);
  });
});
