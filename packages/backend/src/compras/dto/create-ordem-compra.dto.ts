// ==============================================================================
// DTO - CreateOrdemCompraDto
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: Define a estrutura de dados para a criação de uma nova ordem de compra.
// ==============================================================================
import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ItemOrdemCompraDto } from './item-ordem-compra.dto';

export class CreateOrdemCompraDto {
  @IsUUID()
  @IsNotEmpty()
  fornecedorId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemOrdemCompraDto)
  itens: ItemOrdemCompraDto[];
}
