// ==============================================================================
// DTO - CreateContaFinanceiraDto
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: Define a estrutura de dados para a criação de uma nova
//            conta financeira (caixa ou banco).
// ==============================================================================
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsNumber, Min } from 'class-validator';
import { TipoConta } from '../entities/conta-financeira.entity';

export class CreateContaFinanceiraDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsEnum(TipoConta)
  @IsOptional()
  tipo?: TipoConta;

  @IsNumber()
  @Min(0)
  @IsOptional()
  saldoInicial?: number;
}
