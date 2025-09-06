// ==============================================================================
// Estratégia - JwtStrategy
// Autor: Deivid Lucas
// Versão: 1.1
// Descrição: Estratégia do Passport para validar os tokens de acesso JWT.
//            Extrai o token do cabeçalho da requisição, verifica a sua
//            assinatura e extrai o payload com os dados do utilizador.
// ==============================================================================
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      // Define que o token será extraído do cabeçalho 'Authorization' como um 'Bearer Token'
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Garante que a verificação de expiração do token não é delegada
      ignoreExpiration: false,
      // A chave secreta para verificar a assinatura do token
      // CORREÇÃO: Usar o operador '!' para garantir ao TypeScript que o valor não será undefined.
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  /**
   * Este método é chamado pelo Passport após validar o token com sucesso.
   * O seu retorno é o que será anexado ao objeto 'request' como 'req.user'.
   * @param payload - O conteúdo decifrado do token JWT.
   */
  async validate(payload: { sub: string; email: string }) {
    // Podemos usar o ID do utilizador (sub) do payload para buscar o
    // utilizador completo no banco de dados, se precisarmos de mais informações.
    // Por agora, retornar o payload é suficiente.
    return { userId: payload.sub, email: payload.email };
  }
}
