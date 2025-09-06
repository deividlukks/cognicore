// ==============================================================================
// Controller - TenantsController
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: Expõe os endpoints da API para gerir tenants.
//            Inicialmente, contém a rota para criar um novo tenant.
// ==============================================================================

import { Controller, Post, Body } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Public() // Marcar o registo de tenants como público
  @Post()
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantsService.create(createTenantDto);
  }
}
