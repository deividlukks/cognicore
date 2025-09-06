import { IsString, IsOptional, IsEmail } from 'class-validator';

export class ContatoDto {
  @IsString()
  nome: string;

  @IsString()
  @IsOptional()
  telefone?: string;

  @IsString()
  @IsOptional()
  celular?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
