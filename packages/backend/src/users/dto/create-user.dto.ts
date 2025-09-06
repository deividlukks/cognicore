// ==============================================================================
// DTO - Create User
// Autor: Deivid Lucas
// Versão: 1.1
// Descrição: Adicionada a propriedade 'roles' para permitir a atribuição
//            de perfis de utilizador durante a sua criação.
// ==============================================================================
import { IsEmail, IsNotEmpty, IsString, MinLength, IsArray, IsEnum, IsOptional } from 'class-validator';
import { Role } from '../../auth/enums/role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  tenantId: string;

  // Correção: Adicionando a propriedade roles
  @IsArray()
  @IsEnum(Role, { each: true })
  @IsOptional()
  roles?: Role[];
}