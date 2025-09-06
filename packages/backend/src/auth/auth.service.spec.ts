// ==============================================================================
// Teste Unitário - AuthService (com Correção de Mock)
// Autor: Deivid Lucas
// Versão: 1.4
// Descrição: Corrigido o tipo do mock de utilizador para ser mais completo
//            e corresponder à entidade User real.
// ==============================================================================

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Tenant } from '../tenants/entities/tenant.entity';
import { Role } from './enums/role.enum';

// Mock do bcrypt
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  // Mock do UsersService com todos os métodos necessários
  const mockUsersService = {
    findOneByEmail: jest.fn(),
    findOneByEmailWithTenant: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('test_token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object if password is valid', async () => {
      const user = {
        password: 'hashed_password',
        email: 'test@test.com',
      } as User;
      mockUsersService.findOneByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@test.com', 'password123');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      expect(result).toEqual(userWithoutPassword);
    });

    it('should return null if password is invalid', async () => {
      const user = {
        password: 'hashed_password',
        email: 'test@test.com',
      } as User;
      mockUsersService.findOneByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('test@test.com', 'wrong_password');
      expect(result).toBeNull();
    });

    it('should return null if user is not found', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue(null);
      const result = await service.validateUser('notfound@test.com', 'password');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      // Correção: Criar um mock de utilizador mais completo
      const mockUser: User = {
        id: 'some-id',
        name: 'Test User',
        email: 'test@test.com',
        password: 'hashed_password',
        roles: [Role.USER],
        tenant: new Tenant(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await service.login(mockUser);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
        roles: mockUser.roles,
      });
      expect(result).toEqual({ access_token: 'test_token' });
    });
  });

  describe('preLoginValidate', () => {
    it('should return user data if user is found', async () => {
      const mockUser = {
        name: 'Test User',
        tenant: { name: 'Test Tenant', subdomain: 'test' },
      } as User;
      mockUsersService.findOneByEmailWithTenant.mockResolvedValue(mockUser);

      const result = await service.preLoginValidate('test@test.com');

      expect(result).toEqual({
        userName: mockUser.name,
        tenantName: mockUser.tenant.name,
        tenantSubdomain: mockUser.tenant.subdomain,
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUsersService.findOneByEmailWithTenant.mockResolvedValue(null);

      await expect(
        service.preLoginValidate('notfound@test.com'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});

