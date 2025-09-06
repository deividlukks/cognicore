// ==============================================================================
// Serviço - TenantsService
// Autor: Deivid Lucas
// Versão: 1.1
// Descrição: Contém a lógica de negócios para gerenciar tenants.
//            Inclui métodos para criar um novo tenant e seu schema, e para
//            buscar um tenant pelo seu subdomínio.
// ==============================================================================

import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Tenant } from './entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(
    // Injeta o repositório da entidade Tenant para interações com a tabela 'public.tenants'
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,

    // Injeta o DataSource para poder executar queries nativas (raw SQL)
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Cria um novo tenant e seu schema correspondente no banco de dados.
   * @param createTenantDto - Os dados para a criação do novo tenant.
   * @returns O tenant recém-criado.
   * @throws ConflictException se o subdomínio já estiver em uso.
   */
  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    const { name, subdomain } = createTenantDto;

    // 1. Verifica se o subdomínio já existe para evitar duplicatas
    const existingTenant = await this.tenantRepository.findOne({ where: { subdomain } });
    if (existingTenant) {
      throw new ConflictException(`O subdomínio '${subdomain}' já está em uso.`);
    }

    // 2. Cria e salva a nova instância do tenant na tabela 'public.tenants'
    const newTenant = this.tenantRepository.create({ name, subdomain });
    const savedTenant = await this.tenantRepository.save(newTenant);

    // 3. Cria o schema específico para o novo tenant no banco de dados
    //    Usamos uma query nativa para isso. É importante sanitizar o nome do schema.
    const schemaName = subdomain.replace(/-/g, '_'); // Troca hífens por underscores
    await this.dataSource.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

    return savedTenant;
  }

  /**
   * Encontra um tenant pelo seu subdomínio.
   * @param subdomain - O subdomínio a ser pesquisado.
   * @returns O objeto Tenant se encontrado, caso contrário, null.
   */
  async findBySubdomain(subdomain: string): Promise<Tenant | null> {
    return this.tenantRepository.findOne({ where: { subdomain } });
  }
}
