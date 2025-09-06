// ==============================================================================
// Serviço - AuthService
// Autor: Deivid Lucas
// Versão: 2.5
// Descrição: Corrigida a chamada para o método 'findOneByEmailAndTenant' do
//            UsersService, que agora existe e garante a busca correta do
//            utilizador por tenant.
// ==============================================================================
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async preLogin(email: string): Promise<{ tenantId: string }> {
    const user = await this.usersService.findOneByEmailWithTenant(email);
    if (!user || !user.tenant) {
      throw new UnauthorizedException('Utilizador não encontrado.');
    }
    return { tenantId: user.tenant.id };
  }

  async validateUser(email: string, pass: string, tenantId: string): Promise<Omit<User, 'password'> | null> {
    // --- ADICIONE ESTE LOG ---
    console.log('--- [AuthService.validateUser] ---');
    console.log('A validar com:', { email, tenantId });
    // -------------------------------------
    
    // Correção: Chamando o método correto que agora existe no UsersService
    const user = await this.usersService.findOneByEmailAndTenant(email, tenantId);
    // --- ADICIONE ESTE LOG ---
    console.log('Utilizador encontrado:', user);
    // -------------------------------------

    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      tenantId: user.tenant.id,
    };
    const accessToken = this.jwtService.sign(payload);
    const tenant = user.tenant;
    let redirectUrl: string;
    const baseUrl = process.env.BASE_URL || 'cognicore.com';
    const protocol = process.env.PROTOCOL || 'http://';

    if (tenant.isMaster) {
      redirectUrl = `${protocol}${baseUrl}/dashboard`;
    } else {
      redirectUrl = `${protocol}${tenant.subdomain}.${baseUrl}/dashboard`;
    }

    // --- ADICIONE ESTE LOG ---
    console.log('--- [AuthService.login] ---');
    console.log('Tenant:', tenant);
    console.log('URL de Redirecionamento Gerada:', redirectUrl);
    console.log('---------------------------');
    // --------------------------------

    return {
      access_token: accessToken,
      redirect_url: redirectUrl,
    };
  }
}