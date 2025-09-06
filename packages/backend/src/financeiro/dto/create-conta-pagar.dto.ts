// ==============================================================================
// DTO - CreateContaPagarDto
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: Define a estrutura de dados para o registo de uma nova
//            conta a pagar.
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

export class CreateContaPagarDto {
  // --- Dados da Dívida ---
  @IsUUID()
  @IsNotEmpty()
  fornecedorId: string;

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

  @IsString()
  @IsNotEmpty()
  historico: string;

  // --- Dados Opcionais do Pagamento (usados na criação) ---
  @IsString()
  @IsOptional()
  formaPagamento?: string;

  @IsString()
  @IsOptional()
  categoria?: string;

  @IsString()
  @IsOptional()
  numeroDocumento?: string;

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
