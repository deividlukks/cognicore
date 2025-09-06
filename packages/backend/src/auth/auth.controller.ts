// ==============================================================================
// Controller - Auth
// Autor: Deivid Lucas
// Versão: 1.3
// Descrição: Adicionado o decorador @HttpCode(200) às rotas de 'pre-login' e
//            'login' para garantir que o backend retorne o status HTTP 200 OK
//            com o corpo da resposta, corrigindo o erro no frontend.
// ==============================================================================
import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { PreLoginDto } from './dto/pre-login.dto';
import { Public } from './decorators/public.decorator';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('pre-login')
  // Correção: Definir o código de status de sucesso para 200 OK
  @HttpCode(HttpStatus.OK)
  async preLogin(@Body() preLoginDto: PreLoginDto) {
    return this.authService.preLogin(preLoginDto.email);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  // Correção: Definir o código de status de sucesso para 200 OK
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: { user: User }) {
    return this.authService.login(req.user);
  }
}