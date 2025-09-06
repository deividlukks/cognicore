import { IsInt, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class EstoqueDto {
  // Para criar um estoque, precisamos saber em qual local ele se refere.
  // A API enviará o ID do local.
  @IsUUID()
  localId: string;

  @IsInt() @Min(0) @IsOptional()
  quantidade?: number;

  @IsInt() @Min(0) @IsOptional()
  estoqueMinimo?: number;

  @IsInt() @Min(0) @IsOptional()
  estoqueMaximo?: number;

  @IsInt() @Min(0) @IsOptional()
  crossdocking?: number;

  @IsNumber() @Min(0) @IsOptional()
  precoCompraUnitario?: number;

  @IsNumber() @Min(0) @IsOptional()
  custoCompraUnitario?: number;
}
