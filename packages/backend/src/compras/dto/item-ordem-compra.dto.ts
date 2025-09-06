// ==============================================================================
// DTO - ItemOrdemCompraDto
// Autor: Deivid Lucas
// Versão: 1.1
// Descrição: Define a estrutura de dados para um item dentro de uma ordem de compra,
//            agora incluindo o local de destino do estoque.
// ==============================================================================
import { IsInt, IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class ItemOrdemCompraDto {
  @IsUUID()
  @IsNotEmpty()
  produtoId: string;

  @IsUUID()
  @IsNotEmpty()
  localId: string; // O ID do local onde o produto será armazenado

  @IsInt()
  @Min(1)
  quantidade: number;

  @IsNumber()
  @Min(0)
  custoUnitario: number;
}
