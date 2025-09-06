// ==============================================================================
// DTO - ItemOrdemVendaDto
// Autor: Deivid Lucas
// Versão: 1.1
// Descrição: Define a estrutura de dados para um item dentro de uma ordem de venda,
//            incluindo o local de origem do estoque.
// ==============================================================================
import { IsInt, IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class ItemOrdemVendaDto {
  @IsUUID()
  @IsNotEmpty()
  produtoId: string;

  @IsUUID()
  @IsNotEmpty()
  localId: string;

  @IsInt()
  @Min(1)
  quantidade: number;

  @IsNumber()
  @Min(0)
  precoUnitario: number;
}
