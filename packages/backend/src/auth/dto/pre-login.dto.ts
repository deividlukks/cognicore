// ==============================================================================
// DTO - PreLoginDto
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: Define a estrutura de dados para a primeira etapa do processo
//            de login, que valida apenas o e-mail.
// ==============================================================================
import { IsEmail, IsNotEmpty } from 'class-validator';

export class PreLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
