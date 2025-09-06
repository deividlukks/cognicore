// ==============================================================================
// Serviço - ComprasService (Completo e Corrigido)
// Autor: Deivid Lucas
// Versão: 1.2
// Descrição: Versão completa do serviço, com a lógica de 'findOne' corrigida
//            para tratar corretamente o caso de uma ordem não encontrada.
// ==============================================================================
import { Inject, Injectable, BadRequestException, NotFoundException, forwardRef } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Cliente, TipoCadastro } from '../vendas/entities/cliente.entity';
import { OrdemCompra, StatusOrdemCompra } from './entities/ordem-compra.entity';
import { CreateOrdemCompraDto } from './dto/create-ordem-compra.dto';
import { Produto } from '../estoque/entities/produto.entity';
import { Local } from '../estoque/entities/local.entity';
import { ItemOrdemCompra } from './entities/item-ordem-compra.entity';
import { EstoqueService } from '../estoque/estoque.service';
import { TipoMovimento } from '../estoque/entities/movimento-estoque.entity';

@Injectable()
export class ComprasService {
  constructor(
    @Inject('TENANT_CONNECTION') private tenantConnection: DataSource,
    @Inject('CLIENTE_REPOSITORY') private fornecedorRepository: Repository<Cliente>,
    @Inject('ORDEM_COMPRA_REPOSITORY') private ordemCompraRepository: Repository<OrdemCompra>,
    @Inject('PRODUTO_REPOSITORY') private produtoRepository: Repository<Produto>,
    @Inject('LOCAL_REPOSITORY') private localRepository: Repository<Local>,
    @Inject(forwardRef(() => EstoqueService)) private readonly estoqueService: EstoqueService,
  ) {}

  async createOrdemCompra(dto: CreateOrdemCompraDto): Promise<OrdemCompra> {
    const queryRunner = this.tenantConnection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { fornecedorId, itens } = dto;
      const fornecedor = await this.fornecedorRepository.findOneBy({ id: fornecedorId });
      if (!fornecedor) throw new NotFoundException(`Fornecedor com ID ${fornecedorId} não encontrado.`);
      if (fornecedor.tipoCadastro !== TipoCadastro.FORNECEDOR) {
        throw new BadRequestException(`O registo com ID ${fornecedorId} não é um fornecedor.`);
      }

      let valorTotal = 0;
      const itensCompra: ItemOrdemCompra[] = [];

      for (const itemDto of itens) {
        const produto = await this.produtoRepository.findOneBy({ id: itemDto.produtoId });
        if (!produto) throw new NotFoundException(`Produto com ID ${itemDto.produtoId} não encontrado.`);
        
        const local = await this.localRepository.findOneBy({ id: itemDto.localId });
        if (!local) throw new NotFoundException(`Local com ID ${itemDto.localId} não encontrado.`);

        const custoTotalItem = itemDto.quantidade * itemDto.custoUnitario;
        valorTotal += custoTotalItem;

        const novoItem = new ItemOrdemCompra();
        novoItem.produto = produto;
        novoItem.local = local;
        novoItem.quantidade = itemDto.quantidade;
        novoItem.custoUnitario = itemDto.custoUnitario;
        novoItem.custoTotal = custoTotalItem;
        itensCompra.push(novoItem);
      }

      const novaOrdem = this.ordemCompraRepository.create({ fornecedor, itens: itensCompra, valorTotal });
      const ordemSalva = await queryRunner.manager.save(novaOrdem);

      for (const item of ordemSalva.itens) {
        await this.estoqueService.movimentarEstoque({
          produtoId: item.produto.id,
          localId: item.local.id,
          quantidade: item.quantidade,
          tipo: TipoMovimento.ENTRADA_RECEBIMENTO,
          documentoReferencia: `Ordem de Compra #${ordemSalva.numero}`,
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

  findAll(): Promise<OrdemCompra[]> {
    return this.ordemCompraRepository.find({ relations: ['fornecedor', 'itens', 'itens.produto'] });
  }

  // --- CORREÇÃO APLICADA AQUI ---
  async findOne(id: string): Promise<OrdemCompra> {
    const ordem = await this.ordemCompraRepository.findOne({
      where: { id },
      relations: ['fornecedor', 'itens', 'itens.produto', 'itens.local'],
    });

    // A verificação deve ser feita *depois* da consulta
    if (!ordem) {
      throw new NotFoundException(`Ordem de Compra com ID ${id} não encontrada.`);
    }

    return ordem;
  }

  async cancelarOrdemCompra(id: string): Promise<OrdemCompra> {
    const queryRunner = this.tenantConnection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const ordem = await this.ordemCompraRepository.findOne({
        where: { id },
        relations: ['itens', 'itens.produto', 'itens.local'],
      });

      if (!ordem) throw new NotFoundException(`Ordem de Compra com ID ${id} não encontrada.`);
      if (ordem.status === StatusOrdemCompra.CANCELADA) {
        throw new BadRequestException('Esta Ordem de Compra já está cancelada.');
      }

      for (const item of ordem.itens) {
        await this.estoqueService.movimentarEstoque({
          produtoId: item.produto.id,
          localId: item.local.id,
          quantidade: -item.quantidade,
          tipo: TipoMovimento.SAIDA_CANCELAMENTO_COMPRA,
          documentoReferencia: `Cancelamento da Ordem de Compra #${ordem.numero}`,
        });
      }

      ordem.status = StatusOrdemCompra.CANCELADA;
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
}
