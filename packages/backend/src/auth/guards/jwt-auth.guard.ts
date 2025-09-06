// ==============================================================================
// Guarda - JwtAuthGuard (Inteligente)
// Autor: Deivid Lucas
// Versão: 1.1
// Descrição: Um guarda de autenticação JWT que verifica se um endpoint foi
//            marcado com o decorador @Public antes de exigir um token.
// ==============================================================================
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Verifica se o decorador @Public() está presente no endpoint
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Se for público, permite o acesso sem verificar o token
    if (isPublic) {
      return true;
    }

    // Se não for público, procede com a verificação normal do token JWT
    return super.canActivate(context);
  }
}
