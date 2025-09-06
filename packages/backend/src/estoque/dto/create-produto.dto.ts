// ==============================================================================
// DTO - CreateProdutoDto (Expandido)
// Autor: Deivid Lucas
// Versão: 2.1
// Descrição: DTO final para a criação de um novo produto, incluindo
//            todas as seções: dados básicos, características, relações
//            e as novas seções de estoque e tributação.
// ==============================================================================
import {
  IsString, IsNotEmpty, Length, IsNumber, Min, IsOptional, IsEnum,
  IsBoolean, IsArray, ValidateNested, IsUrl, IsInt, IsObject
} from 'class-validator';
import { Type } from 'class-transformer';
import { FormatoProduto, CondicaoProduto, ProducaoProduto, UnidadeMedida } from '../entities/produto.entity';
import { VariacaoDto } from './variacao.dto';
import { ImagemProdutoDto } from './imagem-produto.dto';
import { TributacaoDto } from './tributacao.dto'; // 1. Importar TributacaoDto
import { EstoqueDto } from './estoque.dto'; // 2. Importar EstoqueDto

export class CreateProdutoDto {
  // --- Dados Básicos ---
  @IsString() @IsNotEmpty() @Length(3, 255)
  descricao: string;

  @IsString() @IsOptional() @Length(1, 100)
  codigoReferenciaFornecedor?: string;

  @IsNumber() @Min(0)
  precoVenda: number;

  @IsString() @IsOptional() @Length(1, 50)
  unidade?: string;

  @IsEnum(FormatoProduto) @IsOptional()
  formato?: FormatoProduto;

  @IsEnum(CondicaoProduto) @IsOptional()
  condicao?: CondicaoProduto;

  @IsString() @IsOptional() @Length(3, 255)
  categoria?: string;

  // --- Características ---
  @IsString() @IsOptional() @Length(2, 100)
  marca?: string;

  @IsEnum(ProducaoProduto) @IsOptional()
  producao?: ProducaoProduto;

  @IsInt() @Min(0) @IsOptional()
  shelfLife?: number;

  @IsBoolean() @IsOptional()
  freteGratis?: boolean;

  @IsNumber() @Min(0) @IsOptional()
  pesoLiquido?: number;

  @IsNumber() @Min(0) @IsOptional()
  pesoBruto?: number;

  @IsNumber() @Min(0) @IsOptional()
  largura?: number;

  @IsNumber() @Min(0) @IsOptional()
  altura?: number;

  @IsNumber() @Min(0) @IsOptional()
  profundidade?: number;

  @IsInt() @Min(1) @IsOptional()
  volumes?: number;

  @IsInt() @Min(1) @IsOptional()
  itensPorEmbalagem?: number;

  @IsEnum(UnidadeMedida) @IsOptional()
  unidadeMedida?: UnidadeMedida;

  @IsString() @IsOptional() @Length(13, 13)
  gtin13?: string;

  @IsString() @IsOptional() @Length(14, 14)
  gtin14?: string;

  @IsString() @IsOptional()
  descricaoCurta?: string;

  @IsString() @IsOptional()
  descricaoComplementar?: string;

  @IsUrl() @IsOptional()
  videoUrl?: string;

  // --- Relações ---
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariacaoDto)
  @IsOptional()
  variacoes?: VariacaoDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImagemProdutoDto)
  @IsOptional()
  imagens?: ImagemProdutoDto[];
  
  // 3. Adicionar as novas seções
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EstoqueDto)
  @IsOptional()
  estoques?: EstoqueDto[];

  @IsObject()
  @ValidateNested()
  @Type(() => TributacaoDto)
  @IsOptional()
  tributacao?: TributacaoDto;
}
