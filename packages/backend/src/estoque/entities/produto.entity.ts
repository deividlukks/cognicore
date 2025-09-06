// ==============================================================================
// Entidade - Produto (Expandida)
// Autor: Deivid Lucas
// Versão: 2.1
// Descrição: Representa a tabela de produtos com um cadastro completo,
//            incluindo relações com variações, imagens, estoque e tributação.
// ==============================================================================

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Variacao } from './variacao.entity';
import { ImagemProduto } from './imagem-produto.entity';
import { Estoque } from './estoque.entity';
import { Tributacao } from './tributacao.entity';

// Enums para campos com opções fixas
export enum FormatoProduto {
  SIMPLES = 'simples',
  COM_VARIACAO = 'com_variacao',
  COMPOSICAO = 'composicao',
}

export enum CondicaoProduto {
  NOVO = 'novo',
  USADO = 'usado',
  RECONDICIONADO = 'recondicionado',
}

export enum ProducaoProduto {
  PROPRIA = 'propria',
  TERCEIROS = 'terceiros',
}

export enum UnidadeMedida {
  M = 'm',
  CM = 'cm',
  MM = 'mm',
}

@Entity({ name: 'produtos' })
export class Produto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- Dados Básicos ---
  @Column({ type: 'int', unique: true })
  @Generated('increment')
  sku: number;

  @Column({ type: 'varchar', length: 255 })
  descricao: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  codigoReferenciaFornecedor: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precoVenda: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  unidade: string;

  @Column({ type: 'enum', enum: FormatoProduto, default: FormatoProduto.SIMPLES })
  formato: FormatoProduto;

  @Column({ type: 'enum', enum: CondicaoProduto, default: CondicaoProduto.NOVO })
  condicao: CondicaoProduto;

  @Column({ type: 'varchar', length: 255, nullable: true })
  categoria: string;

  // --- Características ---
  @Column({ type: 'varchar', length: 100, nullable: true })
  marca: string;

  @Column({ type: 'enum', enum: ProducaoProduto, nullable: true })
  producao: ProducaoProduto;

  @Column({ type: 'int', nullable: true }) // Em dias
  shelfLife: number;

  @Column({ type: 'boolean', default: false })
  freteGratis: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  pesoLiquido: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  pesoBruto: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  largura: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  altura: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  profundidade: number;

  @Column({ type: 'int', default: 1 })
  volumes: number;

  @Column({ type: 'int', default: 1 })
  itensPorEmbalagem: number;

  @Column({ type: 'enum', enum: UnidadeMedida, default: UnidadeMedida.CM })
  unidadeMedida: UnidadeMedida;

  @Column({ type: 'varchar', length: 13, nullable: true })
  gtin13: string;

  @Column({ type: 'varchar', length: 14, nullable: true })
  gtin14: string;

  @Column({ type: 'text', nullable: true })
  descricaoCurta: string;

  @Column({ type: 'text', nullable: true })
  descricaoComplementar: string;
  
  @Column({ type: 'varchar', nullable: true })
  videoUrl: string;

  // --- Relações ---
  @OneToMany(() => Variacao, (variacao) => variacao.produto, { cascade: true })
  variacoes: Variacao[];

  @OneToMany(() => ImagemProduto, (imagem) => imagem.produto, { cascade: true })
  imagens: ImagemProduto[];

  @OneToMany(() => Estoque, (estoque) => estoque.produto, { cascade: true })
  estoques: Estoque[];

  @OneToOne(() => Tributacao, (tributacao) => tributacao.produto, { cascade: true })
  tributacao: Tributacao;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
