// ==============================================================================
// DTO - LoginDto
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: Define a estrutura de dados para uma requisição de login.
// ==============================================================================
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
