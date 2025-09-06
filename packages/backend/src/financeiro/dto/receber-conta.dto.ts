// ==============================================================================
// DTO - ReceberContaDto
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: Define a estrutura de dados para liquidar (receber) uma
//            conta a receber existente.
// ==============================================================================
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsUUID,
  IsDateString,
} from 'class-validator';

export class ReceberContaDto {
  @IsUUID()
  @IsNotEmpty()
  contaFinanceiraId: string; // Em qual caixa/banco o dinheiro vai entrar

  @IsDateString()
  @IsNotEmpty()
  dataRecebimento: Date;

  @IsString()
  @IsNotEmpty()
  formaPagamento: string;

  // O valor efetivamente recebido. Se não for fornecido, assume o valor total da conta.
  @IsNumber()
  @Min(0.01)
  @IsOptional()
  valorRecebido?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  juros?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  multa?: number;
}
