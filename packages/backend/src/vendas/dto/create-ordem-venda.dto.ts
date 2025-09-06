// ==============================================================================
// DTO - CreateOrdemVendaDto
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: Define a estrutura de dados para a criação de uma nova ordem de venda.
// ==============================================================================
import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ItemOrdemVendaDto } from './item-ordem-venda.dto';

export class CreateOrdemVendaDto {
  @IsUUID()
  @IsNotEmpty()
  clienteId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemOrdemVendaDto)
  itens: ItemOrdemVendaDto[];
}
