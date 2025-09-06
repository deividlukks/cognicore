// ==============================================================================
// Guarda de Funções (RolesGuard)
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: Guarda que verifica se o utilizador autenticado tem a(s) função(ões)
//            necessária(s) para aceder a um endpoint protegido.
// ==============================================================================

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Obtém as funções necessárias para o endpoint, definidas pelo decorador @Roles
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. Se não houver funções definidas, o endpoint é público para qualquer utilizador autenticado
    if (!requiredRoles) {
      return true;
    }

    // 3. Obtém os dados do utilizador a partir da requisição (adicionados pelo JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();

    // 4. Se não houver utilizador ou se o utilizador não tiver funções, nega o acesso
    if (!user || !user.roles) {
      return false;
    }

    // 5. Verifica se o utilizador tem pelo menos uma das funções necessárias
    return requiredRoles.some((role) => user.roles.includes(role));
  }
}
