// ==============================================================================
// Serviço - VendasService (com Cancelamento)
// Autor: Deivid Lucas
// Versão: 1.2
// Descrição: Contém a lógica de negócio para criar e cancelar Ordens de Venda.
// ==============================================================================
import { Inject, Injectable, BadRequestException, NotFoundException, forwardRef } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Cliente, TipoPessoa } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { OrdemVenda, StatusOrdemVenda } from './entities/ordem-venda.entity';
import { CreateOrdemVendaDto } from './dto/create-ordem-venda.dto';
import { Produto } from '../estoque/entities/produto.entity';
import { Local } from '../estoque/entities/local.entity';
import { ItemOrdemVenda } from './entities/item-ordem-venda.entity';
import { EstoqueService } from '../estoque/estoque.service';
import { TipoMovimento } from '../estoque/entities/movimento-estoque.entity';

@Injectable()
export class VendasService {
  constructor(
    @Inject('TENANT_CONNECTION') private tenantConnection: DataSource,
    @Inject('CLIENTE_REPOSITORY') private clienteRepository: Repository<Cliente>,
    @Inject('ORDEM_VENDA_REPOSITORY') private ordemVendaRepository: Repository<OrdemVenda>,
    @Inject('PRODUTO_REPOSITORY') private produtoRepository: Repository<Produto>,
    @Inject('LOCAL_REPOSITORY') private localRepository: Repository<Local>,
    @Inject(forwardRef(() => EstoqueService)) private readonly estoqueService: EstoqueService,
  ) {}

  async createOrdemVenda(dto: CreateOrdemVendaDto): Promise<OrdemVenda> {
    const queryRunner = this.tenantConnection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { clienteId, itens } = dto;
      const cliente = await this.clienteRepository.findOneBy({ id: clienteId });
      if (!cliente) throw new NotFoundException(`Cliente com ID ${clienteId} não encontrado.`);

      let valorTotal = 0;
      const itensVenda: ItemOrdemVenda[] = [];

      for (const itemDto of itens) {
        const produto = await this.produtoRepository.findOneBy({ id: itemDto.produtoId });
        if (!produto) throw new NotFoundException(`Produto com ID ${itemDto.produtoId} não encontrado.`);
        
        const local = await this.localRepository.findOneBy({ id: itemDto.localId });
        if (!local) throw new NotFoundException(`Local com ID ${itemDto.localId} não encontrado.`);

        const precoTotalItem = itemDto.quantidade * itemDto.precoUnitario;
        valorTotal += precoTotalItem;

        const novoItem = new ItemOrdemVenda();
        novoItem.produto = produto;
        novoItem.local = local;
        novoItem.quantidade = itemDto.quantidade;
        novoItem.precoUnitario = itemDto.precoUnitario;
        novoItem.precoTotal = precoTotalItem;
        itensVenda.push(novoItem);
      }

      const novaOrdem = this.ordemVendaRepository.create({ cliente, itens: itensVenda, valorTotal });
      const ordemSalva = await queryRunner.manager.save(novaOrdem);

      for (const item of ordemSalva.itens) {
        await this.estoqueService.movimentarEstoque({
          produtoId: item.produto.id,
          localId: item.local.id,
          quantidade: -item.quantidade,
          tipo: TipoMovimento.SAIDA_EXPEDICAO,
          documentoReferencia: `Ordem de Venda #${ordemSalva.numero}`,
        });
      }

      await queryRunner.commitTransaction();
      return ordemSalva;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async cancelarOrdemVenda(ordemId: string): Promise<OrdemVenda> {
    const queryRunner = this.tenantConnection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const ordem = await this.ordemVendaRepository.findOne({
        where: { id: ordemId },
        relations: ['itens', 'itens.produto', 'itens.local'],
      });

      if (!ordem) throw new NotFoundException(`Ordem de Venda com ID ${ordemId} não encontrada.`);
      if (ordem.status === StatusOrdemVenda.CANCELADO) {
        throw new BadRequestException('Esta Ordem de Venda já está cancelada.');
      }

      for (const item of ordem.itens) {
        await this.estoqueService.movimentarEstoque({
          produtoId: item.produto.id,
          localId: item.local.id,
          quantidade: item.quantidade,
          tipo: TipoMovimento.ENTRADA_CANCELAMENTO_VENDA,
          documentoReferencia: `Cancelamento da Ordem de Venda #${ordem.numero}`,
        });
      }

      ordem.status = StatusOrdemVenda.CANCELADO;
      const ordemCancelada = await queryRunner.manager.save(ordem);

      await queryRunner.commitTransaction();
      return ordemCancelada;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    if (createClienteDto.tipoPessoa === TipoPessoa.FISICA) {
      if (!createClienteDto.nomeCompleto || !createClienteDto.cpf) {
        throw new BadRequestException('Para Pessoa Física, Nome Completo e CPF são obrigatórios.');
      }
    } else if (createClienteDto.tipoPessoa === TipoPessoa.JURIDICA) {
      if (!createClienteDto.razaoSocial || !createClienteDto.cnpj) {
        throw new BadRequestException('Para Pessoa Jurídica, Razão Social e CNPJ são obrigatórios.');
      }
    }

    const novoCliente = this.clienteRepository.create(createClienteDto);
    return this.clienteRepository.save(novoCliente);
  }

  findAll(): Promise<Cliente[]> {
    return this.clienteRepository.find({ relations: ['pessoasDeContato'] });
  }
}
