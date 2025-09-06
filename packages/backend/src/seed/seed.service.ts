// ==============================================================================
// Serviço de Seed - CogniCore
// Autor: Deivid Lucas
// Versão: 1.4
// Descrição: Atualizado para criar o tenant 'CogniCore' como o tenant "master"
//            da plataforma, definindo a flag 'isMaster' como true.
// ==============================================================================
import { Injectable, OnModuleInit } from '@nestjs/common';
import { TenantsService } from '../tenants/tenants.service';
import { UsersService } from '../users/users.service';
import { Role } from '../auth/enums/role.enum';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    private readonly tenantsService: TenantsService,
    private readonly usersService: UsersService,
  ) {}

  async onModuleInit() {
    await this.seedInitialData();
  }

  async seedInitialData() {
    const cogniCoreSubdomain = 'cognicore';

    // 1. Procura pelo tenant principal
    let cogniCoreTenant = await this.tenantsService.findBySubdomain(cogniCoreSubdomain);

    if (!cogniCoreTenant) {
      console.log('Criando o tenant principal (master): CogniCore...');
      // Correção: Passando isMaster: true na criação
      cogniCoreTenant = await this.tenantsService.create({
        name: 'CogniCore',
        subdomain: cogniCoreSubdomain,
        isMaster: true, // Marca este tenant como o principal
      });
    }

    // 2. Criar o Utilizador SuperAdmin associado ao tenant master
    const adminEmail = 'admin@cognicore.com';
    const userExists = await this.usersService.findOneByEmailWithTenant(
      adminEmail,
    );

    if (!userExists) {
      console.log('Criando o utilizador SuperAdmin...');
      await this.usersService.create({
        name: 'Admin CogniCore',
        email: adminEmail,
        password: 'admin',
        roles: [Role.SUPERADMIN],
        tenantId: cogniCoreTenant.id,
      });
    }

    console.log('Seed de dados concluído.');
  }
}