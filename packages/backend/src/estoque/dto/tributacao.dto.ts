import { IsString, IsOptional, Length, IsNumber, IsObject } from 'class-validator';

export class TributacaoDto {
  @IsString() @IsOptional() @Length(1, 100)
  origem?: string;

  @IsString() @IsOptional() @Length(8, 8)
  ncm?: string;

  @IsString() @IsOptional() @Length(7, 7)
  cest?: string;

  @IsString() @IsOptional() @Length(1, 100)
  tipoItem?: string;

  @IsNumber() @IsOptional()
  percentualTributos?: number;

  @IsString() @IsOptional() @Length(1, 100)
  grupoProdutos?: string;

  @IsObject() @IsOptional()
  icms?: object;

  @IsObject() @IsOptional()
  ipi?: object;

  @IsObject() @IsOptional()
  pisCofins?: object;

  @IsString() @IsOptional()
  informacoesAdicionais?: string;
}
