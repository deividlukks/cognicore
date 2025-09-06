// ==============================================================================
// DTO - CreateLocalDto
// Autor: Deivid Lucas
// Versão: 1.1
// Descrição: Define a estrutura de dados para a criação de um novo local,
//            agora incluindo o campo 'codigo'.
// ==============================================================================
import { IsString, IsNotEmpty, Length, IsOptional } from 'class-validator';

export class CreateLocalDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  codigo: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  nome: string;

  @IsString()
  @IsOptional()
  descricao?: string;
}
