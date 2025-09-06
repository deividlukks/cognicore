// ==============================================================================
// DTO - AjustarInventarioDto
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: Define a estrutura de dados para realizar um ajuste de inventário,
//            comparando a quantidade contada com a quantidade do sistema.
// ==============================================================================
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class AjustarInventarioDto {
  @IsUUID()
  @IsNotEmpty()
  produtoId: string;

  @IsUUID()
  @IsNotEmpty()
  localId: string;

  // A quantidade física que foi contada no inventário.
  @IsInt()
  @Min(0) // A quantidade contada não pode ser negativa.
  @IsNotEmpty()
  quantidadeContada: number;

  @IsString()
  @IsOptional()
  observacao?: string;
}
