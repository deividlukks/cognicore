// ==============================================================================
// DTO - MovimentarEstoqueDto
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: Define a estrutura de dados para registrar uma nova movimentação
//            de estoque (entrada, saída, ajuste, etc.).
// ==============================================================================
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { TipoMovimento } from '../entities/movimento-estoque.entity';

export class MovimentarEstoqueDto {
  @IsUUID()
  @IsNotEmpty()
  produtoId: string;

  @IsUUID()
  @IsNotEmpty()
  localId: string;

  // A quantidade a ser movimentada.
  // Positiva para entradas, negativa para saídas.
  @IsInt()
  @IsNotEmpty()
  quantidade: number;

  @IsEnum(TipoMovimento)
  @IsNotEmpty()
  tipo: TipoMovimento;

  @IsString()
  @IsOptional()
  observacao?: string;

  @IsString()
  @IsOptional()
  documentoReferencia?: string;
}
