// = anotações de serviço (mantidas)
// ==============================================================================
// Serviço - EstoqueService (Corrigido e Simplificado)
// Autor: Deivid Lucas
// Versão: 2.9
// Descrição: Serviço de Estoque com a importação corrigida para
//            MovimentarEstoqueDto.
// ==============================================================================
import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Produto } from './entities/produto.entity';
import { Local } from './entities/local.entity';
import { Estoque } from './entities/estoque.entity';
import { MovimentoEstoque, TipoMovimento } from './entities/movimento-estoque.entity';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { CreateLocalDto } from './dto/create-local.dto';
import { AjustarInventarioDto } from './dto/ajustar-inventario.dto';
import { MovimentarEstoqueDto } from './dto/movimentar-estoque.dto'; // Adicionar esta linha

@Injectable()
export class EstoqueService {
  constructor(
    @Inject('TENANT_CONNECTION') private tenantConnection: DataSource,
    @Inject('PRODUTO_REPOSITORY')
    private produtoRepository: Repository<Produto>,
    @Inject('LOCAL_REPOSITORY')
    private localRepository: Repository<Local>,
    @Inject('ESTOQUE_REPOSITORY')
    private estoqueRepository: Repository<Estoque>,
    @Inject('MOVIMENTO_ESTOQUE_REPOSITORY')
    private movimentoEstoqueRepository: Repository<MovimentoEstoque>,
  ) {}

  // --- LÓGICA DE INVENTÁRIO ---
  async ajustarInventario(dto: AjustarInventarioDto): Promise<MovimentoEstoque | { message: string }> {
    const { produtoId, localId, quantidadeContada, observacao } = dto;
    const estoqueAtual = await this.estoqueRepository.findOne({
      where: { produto: { id: produtoId }, local: { id: localId } },
    });
    const quantidadeSistema = estoqueAtual ? estoqueAtual.quantidade : 0;
    const diferenca = quantidadeContada - quantidadeSistema;

    if (diferenca === 0) {
      return { message: 'Nenhum ajuste necessário. O saldo do sistema já corresponde à contagem.' };
    }

    const movimentarDto: MovimentarEstoqueDto = {
      produtoId,
      localId,
      quantidade: diferenca,
      tipo: TipoMovimento.AJUSTE_INVENTARIO,
      observacao: observacao || `Ajuste de inventário. Contado: ${quantidadeContada}, Sistema: ${quantidadeSistema}.`,
    };
    return this.movimentarEstoque(movimentarDto);
  }

  // --- LÓGICA DE MOVIMENTAÇÃO ---
  async movimentarEstoque(dto: MovimentarEstoqueDto): Promise<MovimentoEstoque> {
    const queryRunner = this.tenantConnection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { produtoId, localId, quantidade, tipo } = dto;
      let estoque = await queryRunner.manager.findOne(Estoque, {
        where: { produto: { id: produtoId }, local: { id: localId } },
        relations: ['produto', 'local'],
      });

      if (!estoque) {
        if (quantidade < 0) {
          throw new BadRequestException(`Produto sem saldo no local para realizar saída.`);
        }
        const produto = await queryRunner.manager.findOneBy(Produto, { id: produtoId });
        const local = await queryRunner.manager.findOneBy(Local, { id: localId });
        if (!produto) throw new NotFoundException(`Produto com ID ${produtoId} não encontrado.`);
        if (!local) throw new NotFoundException(`Local com ID ${localId} não encontrado.`);
        
        estoque = queryRunner.manager.create(Estoque, { produto, local, quantidade: 0 });
      }

      const saldoAnterior = estoque.quantidade;
      const novoSaldo = saldoAnterior + quantidade;

      if (novoSaldo < 0) {
        throw new BadRequestException(`Saldo insuficiente. Saldo atual: ${saldoAnterior}, Tentativa de saída: ${Math.abs(quantidade)}.`);
      }

      estoque.quantidade = novoSaldo;
      await queryRunner.manager.save(estoque);

      const movimento = queryRunner.manager.create(MovimentoEstoque, {
        estoque,
        tipo,
        quantidade,
        saldoAnterior,
        observacao: dto.observacao,
        documentoReferencia: dto.documentoReferencia,
      });
      const movimentoSalvo = await queryRunner.manager.save(movimento);

      await queryRunner.commitTransaction();
      return movimentoSalvo;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // --- Métodos de Cadastro ---
  async createProduto(createProdutoDto: CreateProdutoDto): Promise<Produto> {
    const { estoques, ...produtoData } = createProdutoDto;
    const produto = this.produtoRepository.create(produtoData);

    if (estoques && estoques.length > 0) {
      const estoquesEntities: Estoque[] = [];
      for (const estoqueDto of estoques) {
        const local = await this.localRepository.findOneBy({ id: estoqueDto.localId });
        if (!local) {
          throw new BadRequestException(`O Local com ID '${estoqueDto.localId}' não foi encontrado.`);
        }
        
        const novoEstoque = new Estoque();
        Object.assign(novoEstoque, estoqueDto);
        novoEstoque.local = local;
        estoquesEntities.push(novoEstoque);
      }
      produto.estoques = estoquesEntities;
    }
    return this.produtoRepository.save(produto);
  }

  findAllProdutos(): Promise<Produto[]> {
    return this.produtoRepository.find({
      relations: ['variacoes', 'imagens', 'tributacao', 'estoques', 'estoques.local'],
    });
  }

  createLocal(createLocalDto: CreateLocalDto): Promise<Local> {
    const local = this.localRepository.create(createLocalDto);
    return this.localRepository.save(local);
  }

  findAllLocais(): Promise<Local[]> {
    return this.localRepository.find();
  }
}
