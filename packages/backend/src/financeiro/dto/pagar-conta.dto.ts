// ==============================================================================
// DTO - PagarContaDto
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: Define a estrutura de dados para liquidar (pagar) uma
//            conta a pagar existente.
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

export class PagarContaDto {
  @IsUUID()
  @IsNotEmpty()
  contaFinanceiraId: string; // De qual caixa/banco o dinheiro vai sair

  @IsDateString()
  @IsNotEmpty()
  dataPagamento: Date;

  @IsString()
  @IsNotEmpty()
  formaPagamento: string;

  // O valor efetivamente pago. Se não for fornecido, assume o valor total da conta.
  @IsNumber()
  @Min(0.01)
  @IsOptional()
  valorPago?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  juros?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  multa?: number;
}
