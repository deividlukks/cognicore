// ==============================================================================
// Teste Unitário - TenantsService
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: Testes unitários para o TenantsService, garantindo a correta
//            criação de tenants e o tratamento de conflitos.
// ==============================================================================

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { Tenant } from './entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';

// Mock (simulação) do nosso repositório e do data source
// Isso nos permite controlar o que os métodos do banco de dados retornam
// sem precisar de uma conexão real com o banco durante o teste.
const mockTenantRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockDataSource = {
  query: jest.fn(),
};

describe('TenantsService', () => {
  let service: TenantsService;
  let repository: Repository<Tenant>;
  let dataSource: DataSource;

  // O bloco 'beforeEach' é executado antes de cada teste ('it' block)
  beforeEach(async () => {
    // Cria um módulo de teste do NestJS, simulando o ambiente da nossa aplicação
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantsService,
        {
          provide: getRepositoryToken(Tenant), // Fornece o mock para o repositório do Tenant
          useValue: mockTenantRepository,
        },
        {
          provide: DataSource, // Fornece o mock para o DataSource
          useValue: mockDataSource,
        },
      ],
    }).compile();

    // Obtém as instâncias do serviço e dos mocks para usar nos testes
    service = module.get<TenantsService>(TenantsService);
    repository = module.get<Repository<Tenant>>(getRepositoryToken(Tenant));
    dataSource = module.get<DataSource>(DataSource);

    // Limpa o histórico de chamadas dos mocks antes de cada teste
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Teste do método 'create'
  describe('create', () => {
    // Cenário 1: Criação bem-sucedida
    it('should create a new tenant and its schema successfully', async () => {
      const createTenantDto: CreateTenantDto = {
        name: 'Empresa de Teste',
        subdomain: 'empresa-teste',
      };

      const expectedTenant = {
        id: 'some-uuid',
        ...createTenantDto,
        isActive: true,
      };

      // Configuração dos mocks para este teste específico:
      mockTenantRepository.findOne.mockResolvedValue(null); // Simula que o tenant não existe
      mockTenantRepository.create.mockReturnValue(expectedTenant); // Simula a criação da entidade
      mockTenantRepository.save.mockResolvedValue(expectedTenant); // Simula o salvamento no banco
      mockDataSource.query.mockResolvedValue(undefined); // Simula a execução da query de criação do schema

      // Executa o método a ser testado
      const result = await service.create(createTenantDto);

      // Verificações (Asserts)
      expect(result).toEqual(expectedTenant);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { subdomain: 'empresa-teste' } });
      expect(repository.save).toHaveBeenCalledWith(expectedTenant);
      expect(dataSource.query).toHaveBeenCalledWith('CREATE SCHEMA IF NOT EXISTS "empresa_teste"');
    });

    // Cenário 2: Tentativa de criar com subdomínio duplicado
    it('should throw a ConflictException if the subdomain already exists', async () => {
      const createTenantDto: CreateTenantDto = {
        name: 'Empresa Duplicada',
        subdomain: 'empresa-existente',
      };

      // Configuração do mock: simula que o findOne encontrou um tenant
      mockTenantRepository.findOne.mockResolvedValue({ id: 'another-uuid', ...createTenantDto });

      // Verificação: esperamos que a chamada ao método 'create' seja rejeitada
      // e que a rejeição seja uma instância de ConflictException.
      await expect(service.create(createTenantDto)).rejects.toThrow(ConflictException);

      // Garante que, em caso de erro, o método save e a query não sejam chamados
      expect(repository.save).not.toHaveBeenCalled();
      expect(dataSource.query).not.toHaveBeenCalled();
    });
  });
});
