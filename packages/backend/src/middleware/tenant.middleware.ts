// ==============================================================================
// Middleware - TenantMiddleware
// Autor: Deivid Lucas
// Versão: 1.1
// Descrição: Intercepta todas as requisições para identificar o tenant
//            a partir do subdomínio e anexa-o ao objeto da requisição.
// ==============================================================================

import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantsService } from '../tenants/tenants.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly tenantsService: TenantsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const host = req.headers.host;

    // 1. ADICIONAR VERIFICAÇÃO: Garante que o host existe na requisição.
    if (!host) {
      throw new NotFoundException('Host não encontrado no cabeçalho da requisição.');
    }

    const subdomain = host.split('.')[0];

    if (!subdomain) {
      throw new NotFoundException('Tenant não encontrado.');
    }

    const tenant = await this.tenantsService.findBySubdomain(subdomain);
    if (!tenant) {
      throw new NotFoundException(`Tenant com subdomínio '${subdomain}' não encontrado.`);
    }

    (req as any).tenant = tenant;

    next();
  }
}
