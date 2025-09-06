// ==============================================================================
// Serviço - UsersService (Completo)
// Autor: Deivid Lucas
// Versão: 1.3
// Descrição: Serviço completo para a gestão de utilizadores (users).
//            Inclui a lógica para criar, encontrar e gerir utilizadores,
//            garantindo a encriptação de passwords e a validação de dados,
//            além de fornecer os métodos necessários para o fluxo de autenticação.
// ==============================================================================

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Cria um novo utilizador no sistema.
   * @param createUserDto - Os dados para a criação do novo utilizador.
   * @returns O utilizador recém-criado (sem a password).
   * @throws ConflictException se o e-mail já existir para o tenant.
   */
  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { email, password, tenantId, name, roles } = createUserDto;

    // Verifica se já existe um utilizador com este e-mail para este tenant
    const existingUser = await this.usersRepository.findOne({
      where: { email, tenant: { id: tenantId } },
    });

    if (existingUser) {
      throw new ConflictException(
        'Já existe um utilizador com este e-mail nesta empresa.',
      );
    }

    // Encripta a password antes de a guardar
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
      roles,
      tenant: { id: tenantId }, // Associa o utilizador ao tenant
    });

    const savedUser = await this.usersRepository.save(user);

    // Remove a password do objeto retornado
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = savedUser;
    return result;
  }

  /**
   * Encontra todos os utilizadores.
   * @returns Uma lista de todos os utilizadores.
   */
  findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['tenant'] });
  }

  /**
   * Encontra um utilizador pelo seu ID.
   * @param id - O ID do utilizador a procurar.
   * @returns O objeto do utilizador.
   * @throws NotFoundException se o utilizador não for encontrado.
   */
  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['tenant'],
    });
    if (!user) {
      throw new NotFoundException(`Utilizador com ID "${id}" não encontrado.`);
    }
    return user;
  }

  /**
   * Encontra um utilizador pelo seu e-mail, incluindo a informação do tenant.
   * Usado na etapa de pré-login.
   * @param email - O e-mail do utilizador.
   * @returns O objeto do utilizador com o tenant, ou null se não for encontrado.
   */
  async findOneByEmailWithTenant(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['tenant'],
    });
  }

  /**
   * Encontra um utilizador pelo seu e-mail DENTRO de um tenant específico.
   * Essencial para a validação segura do login.
   * @param email - O e-mail do utilizador.
   * @param tenantId - O ID do tenant no qual procurar.
   * @returns O objeto do utilizador com o tenant, ou null se não for encontrado.
   */
  async findOneByEmailAndTenant(
    email: string,
    tenantId: string,
  ): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        email,
        tenant: { id: tenantId },
      },
      relations: ['tenant'], // Carrega o tenant para o AuthService
    });
  }

  // Futuros métodos de atualização e remoção podem ser adicionados aqui.
  // async update(id: string, updateUserDto: UpdateUserDto): Promise<User> { ... }
  // async remove(id: string): Promise<void> { ... }
}