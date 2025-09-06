import { IsString, IsOptional } from 'class-validator';

export class EnderecoDto {
  @IsString()
  cep: string;

  @IsString()
  uf: string;

  @IsString()
  cidade: string;

  @IsString()
  rua: string;

  @IsString()
  numero: string;

  @IsString()
  bairro: string;

  @IsString()
  @IsOptional()
  complemento?: string;

  @IsString()
  @IsOptional()
  pontoReferencia?: string;
}
