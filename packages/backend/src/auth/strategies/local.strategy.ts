// ==============================================================================
// Estratégia - Local
// Autor: Deivid Lucas
// Versão: 1.1
// Descrição: Estratégia de autenticação local atualizada para receber o objeto
//            de requisição, extrair o 'x-tenant-id' do cabeçalho e passá-lo
//            para o serviço de validação.
// ==============================================================================
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      // Correção: Habilitar o acesso ao objeto 'request' no método validate
      passReqToCallback: true,
    });
  }

  // Correção: A assinatura do método agora inclui 'req' como primeiro argumento
  async validate(req: Request, email: string, password: string): Promise<any> {
    // Correção: Extrair o tenantId do cabeçalho da requisição
    const tenantId = req.headers['x-tenant-id'] as string;

    // --- ADICIONE ESTE LOG ---
    console.log('--- [LocalStrategy] ---');
    console.log('Recebido no validate:');
    console.log({ email, password, tenantId });
    // -------------------------

    if (!tenantId) {
      throw new BadRequestException('O cabeçalho x-tenant-id é obrigatório.');
    }

    // Correção: Chamar o validateUser com os 3 argumentos necessários
    const user = await this.authService.validateUser(email, password, tenantId);
    
    // --- ADICIONE ESTE LOG ---
    console.log('Resultado do validateUser:', user);
    console.log('-------------------------');
    // -------------------------

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }
    return user;
  }
}