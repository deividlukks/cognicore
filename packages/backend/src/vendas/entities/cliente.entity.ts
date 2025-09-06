// ==============================================================================
// Entidade - Cliente (Unificada com Fornecedor)
// Autor: Deivid Lucas
// Versão: 2.0
// Descrição: Representa a tabela unificada de clientes e fornecedores,
//            com todos os campos detalhados para pessoa física e jurídica.
// ==============================================================================
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  OneToMany,
} from 'typeorm';
import { Contato } from './contato.entity';

// Enums para garantir a integridade dos dados
export enum TipoCadastro {
  CLIENTE = 'cliente',
  FORNECEDOR = 'fornecedor',
}

export enum TipoPessoa {
  FISICA = 'fisica',
  JURIDICA = 'juridica',
}

export enum TipoContribuinte {
  CONTRIBUINTE_ICMS = '1',
  CONTRIBUINTE_ISENTO = '2',
  NAO_CONTRIBUINTE = '9',
}

export enum RegimeTributario {
  SIMPLES_NACIONAL = 'simples_nacional',
  SIMPLES_EXCESSO = 'simples_nacional_excesso',
  REGIME_NORMAL = 'regime_normal',
  MEI = 'mei',
}

export enum SituacaoCadastro {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  SEM_MOVIMENTO = 'sem_movimento',
}

export enum EstadoCivil {
  SOLTEIRO = 'solteiro',
  CASADO = 'casado',
  DIVORCIADO = 'divorciado',
  VIUVO = 'viuvo',
}

@Entity({ name: 'clientes' })
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- Dados Cadastrais ---
  @Column({ type: 'int', unique: true })
  @Generated('increment')
  codigo: number;

  @Column({ type: 'enum', enum: TipoCadastro })
  tipoCadastro: TipoCadastro;

  @Column({ type: 'enum', enum: TipoPessoa })
  tipoPessoa: TipoPessoa;

  @CreateDateColumn()
  clienteDesde: Date;

  // --- Dados Pessoa Física ---
  @Column({ type: 'varchar', length: 255, nullable: true })
  nomeCompleto: string;

  @Column({ type: 'varchar', length: 14, unique: true, nullable: true })
  cpf: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  rg: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  orgaoEmissor: string;

  // --- Dados Pessoa Jurídica ---
  @Column({ type: 'varchar', length: 255, nullable: true })
  razaoSocial: string;

  @Column({ type: 'varchar', length: 18, unique: true, nullable: true })
  cnpj: string;

  @Column({ type: 'enum', enum: RegimeTributario, nullable: true })
  codigoRegimeTributario: RegimeTributario;

  // --- Dados Comuns (PF e PJ) ---
  @Column({ type: 'varchar', length: 255, nullable: true })
  fantasia: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  inscricaoEstadual: string;

  @Column({ type: 'boolean', default: false })
  ieIsento: boolean;

  @Column({ type: 'enum', enum: TipoContribuinte })
  contribuinte: TipoContribuinte;

  // --- Endereços (Principal e Cobrança) ---
  @Column({ type: 'jsonb', nullable: true })
  enderecos: object;

  // --- Contato ---
  @OneToMany(() => Contato, (contato) => contato.cliente, { cascade: true })
  pessoasDeContato: Contato[];

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefone: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  celular: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  emailNfe: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  site: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  skype: string;

  // --- Dados Adicionais ---
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  percentualCargaMedia: number;

  @Column({ type: 'date', nullable: true })
  dataNascimento: Date;

  @Column({ type: 'enum', enum: EstadoCivil, nullable: true })
  estadoCivil: EstadoCivil;

  @Column({ type: 'varchar', nullable: true })
  nomeConjuge: string;

  @Column({ type: 'varchar', nullable: true })
  profissao: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  sexo: string;

  @Column({ type: 'varchar', nullable: true })
  naturalidade: string;

  @Column({ type: 'varchar', nullable: true })
  nomePai: string;

  @Column({ type: 'varchar', nullable: true })
  nomeMae: string;
  
  @Column({ type: 'enum', enum: SituacaoCadastro, default: SituacaoCadastro.ATIVO })
  situacaoCadastro: SituacaoCadastro;

  @Column({ type: 'varchar', nullable: true }) // Armazenará o ID do Vendedor/Comprador
  vendedorCompradorId: string;

  @Column({ type: 'varchar', nullable: true })
  naturezaOperacaoPadrao: string;

  @Column({ type: 'varchar', nullable: true })
  inscricaoSuframa: string;

  @Column({ type: 'varchar', nullable: true })
  fotoUrl: string;

  // --- Financeiro ---
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  limiteCredito: number;

  @Column({ type: 'boolean', default: false })
  limiteCreditoIlimitado: boolean;

  @Column({ type: 'boolean', default: false })
  limiteCreditoZero: boolean;

  @Column({ type: 'varchar', nullable: true })
  condicaoPagamento: string;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
