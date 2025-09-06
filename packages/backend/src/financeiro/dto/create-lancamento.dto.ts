// ==============================================================================
// DTO - CreateLancamentoDto
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: Define a estrutura de dados para registar um novo lançamento
//            financeiro de entrada ou saída.
// ==============================================================================
import {
  IsString, IsNotEmpty, IsEnum, IsOptional, IsNumber, Min, IsUUID, IsDateString,
} from 'class-validator';
import { TipoLancamento } from '../entities/lancamento.entity';

export class CreateLancamentoDto {
  @IsUUID()
  @IsNotEmpty()
  contaFinanceiraId: string;

  @IsUUID()
  @IsOptional()
  clienteFornecedorId?: string;

  @IsEnum(TipoLancamento)
  @IsNotEmpty()
  tipo: TipoLancamento;

  @IsNumber()
  @Min(0.01) // O valor de um lançamento deve ser positivo
  valor: number;

  @IsString()
  @IsNotEmpty()
  historico: string;

  @IsString()
  @IsOptional()
  categoria?: string;

  @IsDateString()
  @IsNotEmpty()
  competencia: Date;

  @IsString()
  @IsOptional()
  anexoUrl?: string;
}
