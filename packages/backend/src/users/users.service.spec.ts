// ==============================================================================
// Teste Unitário - UsersService (Completo e Corrigido)
// Autor: Deivid Lucas
// Versão: 1.4
// Descrição: Corrigido o mock do userRepository para incluir o método 'findOne'
//            e ajustado o teste para 'findOneByEmailWithTenant'.
// ==============================================================================

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Tenant } from '../tenants/entities/tenant.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '../auth/enums/role.enum';
import { CreateUserDto } from './dto/create-user.dto';

// Mock do bcrypt para não fazer hashing real nos testes
jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let userRepository;
  let tenantRepository;

  const mockTenant = { id: 'some-uuid', name: 'Test Tenant' } as Tenant;

  beforeEach(async () => {
    // Recriar os mocks antes de cada teste para garantir isolamento
    const mockUserRepository = {
      findOneBy: jest.fn(),
      findOne: jest.fn(), // <--- CORREÇÃO: Adicionar o mock para findOne
      create: jest.fn().mockImplementation((user) => user),
      save: jest.fn(),
    };
    const mockTenantRepository = {
      findOneBy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Tenant),
          useValue: mockTenantRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
    tenantRepository = module.get(getRepositoryToken(Tenant));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user with default role and hashed password', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@test.com',
        password: 'password123',
        tenantId: 'some-uuid',
      };

      const hashedPassword = 'hashed_password';
      const createdUser = {
        ...createUserDto,
        id: 'user-uuid',
        password: hashedPassword,
        roles: [Role.USER],
        tenant: mockTenant,
      };

      userRepository.findOneBy.mockResolvedValue(null);
      tenantRepository.findOneBy.mockResolvedValue(mockTenant);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      userRepository.save.mockResolvedValue(createdUser);

      const result = await service.create(createUserDto);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: createUserDto.email });
      expect(tenantRepository.findOneBy).toHaveBeenCalledWith({ id: createUserDto.tenantId });
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ tenant: mockTenant }),
      );
      expect(result).not.toHaveProperty('password');
    });

    it('should throw BadRequestException if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'exists@test.com',
        password: 'password123',
        tenantId: 'some-uuid',
      };
      userRepository.findOneBy.mockResolvedValue({ id: 'some-id', email: 'exists@test.com' });

      await expect(service.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if tenant does not exist', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@test.com',
        password: 'password123',
        tenantId: 'not-found-uuid',
      };
      userRepository.findOneBy.mockResolvedValue(null);
      tenantRepository.findOneBy.mockResolvedValue(null);

      await expect(service.create(createUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user if found', async () => {
      const mockUser = { id: 'some-id', email: 'test@test.com' };
      userRepository.findOneBy.mockResolvedValue(mockUser);
      const result = await service.findOneByEmail('test@test.com');
      expect(result).toEqual(mockUser);
    });

    it('should return null if not found', async () => {
      userRepository.findOneBy.mockResolvedValue(null);
      const result = await service.findOneByEmail('notfound@test.com');
      expect(result).toBeNull();
    });
  });

  describe('findOneByEmailWithTenant', () => {
    it('should return a user with tenant if found', async () => {
      const mockUser = { id: 'some-id', email: 'test@test.com', tenant: mockTenant };
      // CORREÇÃO: Usar o mock de findOne
      userRepository.findOne.mockResolvedValue(mockUser);
      const result = await service.findOneByEmailWithTenant('test@test.com');
      expect(result).toEqual(mockUser);
      // CORREÇÃO: Verificar a chamada de findOne com os parâmetros corretos
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
        relations: ['tenant'],
      });
    });
  });
});

