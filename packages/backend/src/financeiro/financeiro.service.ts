// ==============================================================================
// Serviço - FinanceiroService (com Recebimentos)
// Autor: Deivid Lucas
// Versão: 1.5
// Descrição: Inclui a lógica transacional para liquidar Contas a Receber,
//            gerando o lançamento financeiro correspondente.
// ==============================================================================
import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { ContaFinanceira } from './entities/conta-financeira.entity';
import { Lancamento, TipoLancamento } from './entities/lancamento.entity';
import { CreateContaFinanceiraDto } from './dto/create-conta-financeira.dto';
import { CreateLancamentoDto } from './dto/create-lancamento.dto';
import { Cliente, TipoCadastro } from '../vendas/entities/cliente.entity';
import { ContaPagar, StatusContaPagar } from './entities/conta-pagar.entity';
import { CreateContaPagarDto } from './dto/create-conta-pagar.dto';
import { ContaReceber, StatusContaReceber } from './entities/conta-receber.entity';
import { CreateContaReceberDto } from './dto/create-conta-receber.dto';
import { PagarContaDto } from './dto/pagar-conta.dto';
import { ReceberContaDto } from './dto/receber-conta.dto';

@Injectable()
export class FinanceiroService {
  constructor(
    @Inject('TENANT_CONNECTION') private tenantConnection: DataSource,
    @Inject('CONTA_FINANCEIRA_REPOSITORY') private contaFinanceiraRepository: Repository<ContaFinanceira>,
    @Inject('LANCAMENTO_REPOSITORY') private lancamentoRepository: Repository<Lancamento>,
    @Inject('CLIENTE_REPOSITORY') private clienteRepository: Repository<Cliente>,
    @Inject('CONTA_PAGAR_REPOSITORY') private contaPagarRepository: Repository<ContaPagar>,
    @Inject('CONTA_RECEBER_REPOSITORY') private contaReceberRepository: Repository<ContaReceber>,
  ) {}

  // --- NOVO MÉTODO DE RECEBIMENTO ---
  async receberConta(contaReceberId: string, dto: ReceberContaDto): Promise<ContaReceber> {
    const queryRunner = this.tenantConnection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Validar a conta a receber
      const contaAReceber = await queryRunner.manager.findOne(ContaReceber, {
        where: { id: contaReceberId },
        relations: ['cliente'],
      });
      if (!contaAReceber) throw new NotFoundException(`Conta a Receber com ID ${contaReceberId} não encontrada.`);
      if (contaAReceber.status === StatusContaReceber.RECEBIDA || contaAReceber.status === StatusContaReceber.CANCELADA) {
        throw new BadRequestException(`Esta conta já foi liquidada ou cancelada.`);
      }

      // 2. Calcular o valor total do recebimento
      const juros = dto.juros || 0;
      const multa = dto.multa || 0;
      const valorRecebido = dto.valorRecebido || Number(contaAReceber.valor) + juros + multa;

      // 3. Criar o lançamento de ENTRADA
      const lancamentoDto: CreateLancamentoDto = {
        contaFinanceiraId: dto.contaFinanceiraId,
        clienteFornecedorId: contaAReceber.cliente.id,
        tipo: TipoLancamento.ENTRADA,
        valor: valorRecebido,
        historico: `Recebimento ref. ao doc #${contaAReceber.numeroDocumento}`,
        competencia: dto.dataRecebimento,
        categoria: contaAReceber.categoria,
      };
      const lancamento = await this.createLancamento(lancamentoDto);

      // 4. Atualizar a conta a receber com os dados do recebimento
      contaAReceber.status = StatusContaReceber.RECEBIDA;
      contaAReceber.dataRecebimento = dto.dataRecebimento;
      contaAReceber.formaPagamento = dto.formaPagamento;
      contaAReceber.juros = juros;
      contaAReceber.multa = multa;
      contaAReceber.lancamento = lancamento;
      contaAReceber.contaFinanceira = lancamento.contaFinanceira;

      const contaRecebida = await queryRunner.manager.save(contaAReceber);

      await queryRunner.commitTransaction();
      return contaRecebida;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // --- Métodos existentes ---
  async pagarConta(contaPagarId: string, dto: PagarContaDto): Promise<ContaPagar> {
    const queryRunner = this.tenantConnection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const contaAPagar = await queryRunner.manager.findOne(ContaPagar, { where: { id: contaPagarId }, relations: ['fornecedor'] });
      if (!contaAPagar) throw new NotFoundException(`Conta a Pagar com ID ${contaPagarId} não encontrada.`);
      if (contaAPagar.status === StatusContaPagar.PAGA || contaAPagar.status === StatusContaPagar.CANCELADA) {
        throw new BadRequestException(`Esta conta já foi liquidada ou cancelada.`);
      }
      const juros = dto.juros || 0;
      const multa = dto.multa || 0;
      const valorPago = dto.valorPago || Number(contaAPagar.valor) + juros + multa;
      const lancamentoDto: CreateLancamentoDto = {
        contaFinanceiraId: dto.contaFinanceiraId,
        clienteFornecedorId: contaAPagar.fornecedor.id,
        tipo: TipoLancamento.SAIDA,
        valor: valorPago,
        historico: `Pagamento ref. a: ${contaAPagar.historico}`,
        competencia: dto.dataPagamento,
        categoria: contaAPagar.categoria,
      };
      const lancamento = await this.createLancamento(lancamentoDto);
      contaAPagar.status = StatusContaPagar.PAGA;
      contaAPagar.dataPagamento = dto.dataPagamento;
      contaAPagar.formaPagamento = dto.formaPagamento;
      contaAPagar.juros = juros;
      contaAPagar.multa = multa;
      contaAPagar.lancamento = lancamento;
      contaAPagar.contaFinanceira = lancamento.contaFinanceira;
      const contaPaga = await queryRunner.manager.save(contaAPagar);
      await queryRunner.commitTransaction();
      return contaPaga;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async createContaReceber(dto: CreateContaReceberDto): Promise<ContaReceber> {
    const { clienteId, ...contaData } = dto;
    const cliente = await this.clienteRepository.findOneBy({ id: clienteId });
    if (!cliente) throw new NotFoundException(`Cliente com ID ${clienteId} não encontrado.`);
    if (cliente.tipoCadastro !== TipoCadastro.CLIENTE) {
      throw new BadRequestException(`O registo com ID ${clienteId} não é um cliente.`);
    }
    const novaConta = this.contaReceberRepository.create({ ...contaData, cliente });
    return this.contaReceberRepository.save(novaConta);
  }

  findAllContasReceber(): Promise<ContaReceber[]> {
    return this.contaReceberRepository.find({ relations: ['cliente'] });
  }

  async createContaPagar(dto: CreateContaPagarDto): Promise<ContaPagar> {
    const { fornecedorId, ...contaData } = dto;
    const fornecedor = await this.clienteRepository.findOneBy({ id: fornecedorId });
    if (!fornecedor) throw new NotFoundException(`Fornecedor com ID ${fornecedorId} não encontrado.`);
    if (fornecedor.tipoCadastro !== TipoCadastro.FORNECEDOR) {
      throw new BadRequestException(`O registo com ID ${fornecedorId} não é um fornecedor.`);
    }
    const novaConta = this.contaPagarRepository.create({ ...contaData, fornecedor });
    return this.contaPagarRepository.save(novaConta);
  }

  findAllContasPagar(): Promise<ContaPagar[]> {
    return this.contaPagarRepository.find({ relations: ['fornecedor'] });
  }

  async createContaFinanceira(dto: CreateContaFinanceiraDto): Promise<ContaFinanceira> {
    const novaConta = this.contaFinanceiraRepository.create({ ...dto, saldoAtual: dto.saldoInicial || 0 });
    return this.contaFinanceiraRepository.save(novaConta);
  }

  findAllContasFinanceiras(): Promise<ContaFinanceira[]> {
    return this.contaFinanceiraRepository.find();
  }

  async createLancamento(dto: CreateLancamentoDto): Promise<Lancamento> {
    const queryRunner = this.tenantConnection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { contaFinanceiraId, clienteFornecedorId, tipo, valor } = dto;
      const conta = await queryRunner.manager.findOneBy(ContaFinanceira, { id: contaFinanceiraId });
      if (!conta) throw new NotFoundException(`Conta Financeira com ID ${contaFinanceiraId} não encontrada.`);
      let clienteFornecedor: Cliente | null = null;
      if (clienteFornecedorId) {
        clienteFornecedor = await queryRunner.manager.findOneBy(Cliente, { id: clienteFornecedorId });
        if (!clienteFornecedor) throw new NotFoundException(`Cliente/Fornecedor com ID ${clienteFornecedorId} não encontrado.`);
      }
      const valorLancamento = tipo === TipoLancamento.ENTRADA ? valor : -valor;
      conta.saldoAtual = Number(conta.saldoAtual) + valorLancamento;
      await queryRunner.manager.save(conta);
      const novoLancamento = queryRunner.manager.create(Lancamento, { ...dto, contaFinanceira: conta });
      if (clienteFornecedor) novoLancamento.clienteFornecedor = clienteFornecedor;
      const lancamentoSalvo = await queryRunner.manager.save(novoLancamento);
      await queryRunner.commitTransaction();
      return lancamentoSalvo;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  findAllLancamentos(): Promise<Lancamento[]> {
    return this.lancamentoRepository.find({ relations: ['contaFinanceira', 'clienteFornecedor'] });
  }
}
