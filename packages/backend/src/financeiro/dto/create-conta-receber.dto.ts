// ==============================================================================
// DTO - CreateContaReceberDto
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: Define a estrutura de dados para o registo de uma nova
//            conta a receber.
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

export class CreateContaReceberDto {
  // --- Dados do Crédito ---
  @IsUUID()
  @IsNotEmpty()
  clienteId: string;

  @IsNumber()
  @Min(0.01)
  valor: number;

  @IsDateString()
  @IsNotEmpty()
  dataEmissao: Date;

  @IsDateString()
  @IsNotEmpty()
  dataCompetencia: Date;

  @IsDateString()
  @IsNotEmpty()
  dataVencimento: Date;

  // --- Dados Opcionais do Recebimento ---
  @IsString()
  @IsOptional()
  formaPagamento?: string;

  @IsString()
  @IsOptional()
  numeroNoBanco?: string;

  @IsString()
  @IsOptional()
  categoria?: string;

  @IsUUID()
  @IsOptional()
  vendedorId?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  juros?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  multa?: number;

  @IsString()
  @IsOptional()
  anexoUrl?: string;
}
