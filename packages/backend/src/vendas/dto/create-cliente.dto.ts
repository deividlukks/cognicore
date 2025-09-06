// ==============================================================================
// DTO - CreateClienteDto
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: DTO completo para o registo unificado de Clientes e Fornecedores,
//            validando todos os campos condicionais e aninhados.
// ==============================================================================
import {
  IsString, IsNotEmpty, IsEnum, IsOptional, ValidateNested, IsArray,
  IsEmail, IsBoolean, IsNumber, IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  TipoCadastro, TipoPessoa, TipoContribuinte, RegimeTributario,
  SituacaoCadastro, EstadoCivil,
} from '../entities/cliente.entity';
import { ContatoDto } from './contato.dto';
import { EnderecoDto } from './endereco.dto';

// DTO para a estrutura aninhada de endereços
class EnderecosDto {
  @ValidateNested()
  @Type(() => EnderecoDto)
  @IsOptional()
  principal?: EnderecoDto;

  @ValidateNested()
  @Type(() => EnderecoDto)
  @IsOptional()
  cobranca?: EnderecoDto;
}

export class CreateClienteDto {
  // --- Dados Cadastrais ---
  @IsEnum(TipoCadastro)
  tipoCadastro: TipoCadastro;

  @IsEnum(TipoPessoa)
  tipoPessoa: TipoPessoa;

  // --- Dados Pessoa Física ---
  @IsString() @IsOptional()
  nomeCompleto?: string;

  @IsString() @IsOptional()
  cpf?: string;

  @IsString() @IsOptional()
  rg?: string;

  @IsString() @IsOptional()
  orgaoEmissor?: string;

  // --- Dados Pessoa Jurídica ---
  @IsString() @IsOptional()
  razaoSocial?: string;

  @IsString() @IsOptional()
  cnpj?: string;

  @IsEnum(RegimeTributario) @IsOptional()
  codigoRegimeTributario?: RegimeTributario;

  // --- Dados Comuns (PF e PJ) ---
  @IsString() @IsOptional()
  fantasia?: string;

  @IsString() @IsOptional()
  inscricaoEstadual?: string;

  @IsBoolean() @IsOptional()
  ieIsento?: boolean;

  @IsEnum(TipoContribuinte)
  contribuinte: TipoContribuinte;

  // --- Endereços ---
  @ValidateNested()
  @Type(() => EnderecosDto)
  @IsOptional()
  enderecos?: EnderecosDto;

  // --- Contato ---
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContatoDto)
  @IsOptional()
  pessoasDeContato?: ContatoDto[];

  @IsString() @IsOptional()
  telefone?: string;

  @IsString() @IsOptional()
  celular?: string;

  @IsEmail() @IsOptional()
  email?: string;

  @IsEmail() @IsOptional()
  emailNfe?: string;

  @IsString() @IsOptional()
  site?: string;

  @IsString() @IsOptional()
  skype?: string;

  // --- Dados Adicionais ---
  @IsNumber() @IsOptional()
  percentualCargaMedia?: number;

  @IsDateString() @IsOptional()
  dataNascimento?: Date;

  @IsEnum(EstadoCivil) @IsOptional()
  estadoCivil?: EstadoCivil;

  @IsString() @IsOptional()
  nomeConjuge?: string;

  @IsString() @IsOptional()
  profissao?: string;

  @IsString() @IsOptional()
  sexo?: string;

  @IsString() @IsOptional()
  naturalidade?: string;

  @IsString() @IsOptional()
  nomePai?: string;

  @IsString() @IsOptional()
  nomeMae?: string;
  
  @IsEnum(SituacaoCadastro) @IsOptional()
  situacaoCadastro?: SituacaoCadastro;

  @IsString() @IsOptional()
  vendedorCompradorId?: string;

  @IsString() @IsOptional()
  naturezaOperacaoPadrao?: string;

  @IsString() @IsOptional()
  inscricaoSuframa?: string;

  @IsString() @IsOptional()
  fotoUrl?: string;

  // --- Financeiro ---
  @IsNumber() @IsOptional()
  limiteCredito?: number;

  @IsBoolean() @IsOptional()
  limiteCreditoIlimitado?: boolean;

  @IsBoolean() @IsOptional()
  limiteCreditoZero?: boolean;

  @IsString() @IsOptional()
  condicaoPagamento?: string;

  @IsString() @IsOptional()
  observacoes?: string;
}
