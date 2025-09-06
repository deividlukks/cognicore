// ==============================================================================
// Módulo - TenantModule (com Contas a Receber)
// Autor: Deivid Lucas
// Versão: 1.4
// Descrição: Módulo partilhado atualizado para incluir a entidade e
//            repositório de Contas a Receber.
// ==============================================================================
import { Module, Global, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Request } from 'express';

// Importar TODAS as entidades específicas do tenant
import { Produto } from '../estoque/entities/produto.entity';
import { Local } from '../estoque/entities/local.entity';
import { Estoque } from '../estoque/entities/estoque.entity';
import { MovimentoEstoque } from '../estoque/entities/movimento-estoque.entity';
import { Cliente } from '../vendas/entities/cliente.entity';
import { Contato } from '../vendas/entities/contato.entity';
import { OrdemVenda } from '../vendas/entities/ordem-venda.entity';
import { ItemOrdemVenda } from '../vendas/entities/item-ordem-venda.entity';
import { Tenant } from '../tenants/entities/tenant.entity';
import { OrdemCompra } from '../compras/entities/ordem-compra.entity';
import { ItemOrdemCompra } from '../compras/entities/item-ordem-compra.entity';
import { ContaFinanceira } from '../financeiro/entities/conta-financeira.entity';
import { Lancamento } from '../financeiro/entities/lancamento.entity';
import { ContaPagar } from '../financeiro/entities/conta-pagar.entity';
import { ContaReceber } from '../financeiro/entities/conta-receber.entity'; // 1. Importar ContaReceber

const TENANT_CONNECTION = 'TENANT_CONNECTION';

const tenantConnectionProvider = {
  provide: TENANT_CONNECTION,
  inject: [ConfigService, 'REQUEST'],
  scope: Scope.REQUEST,
  useFactory: async (configService: ConfigService, req: Request) => {
    const tenant = (req as any).tenant as Tenant;
    if (!tenant) return null;

    const schemaName = tenant.subdomain.replace(/-/g, '_');
    const dataSource = new DataSource({
      type: 'postgres',
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get<string>('DB_USERNAME'),
      password: 'postgres',
      database: configService.get<string>('DB_DATABASE'),
      schema: schemaName,
      // 2. Adicionar a nova entidade à ligação
      entities: [
        Produto, Local, Estoque, MovimentoEstoque, 
        Cliente, Contato, OrdemVenda, ItemOrdemVenda,
        OrdemCompra, ItemOrdemCompra,
        ContaFinanceira, Lancamento, ContaPagar, ContaReceber,
      ],
      synchronize: true,
    } as DataSourceOptions);

    return dataSource.initialize();
  },
};

// Criar uma lista de todos os fornecedores de repositórios
const repositoryProviders = [
  { provide: 'PRODUTO_REPOSITORY', useFactory: (dataSource: DataSource) => dataSource?.getRepository(Produto), inject: [TENANT_CONNECTION] },
  { provide: 'LOCAL_REPOSITORY', useFactory: (dataSource: DataSource) => dataSource?.getRepository(Local), inject: [TENANT_CONNECTION] },
  { provide: 'ESTOQUE_REPOSITORY', useFactory: (dataSource: DataSource) => dataSource?.getRepository(Estoque), inject: [TENANT_CONNECTION] },
  { provide: 'MOVIMENTO_ESTOQUE_REPOSITORY', useFactory: (dataSource: DataSource) => dataSource?.getRepository(MovimentoEstoque), inject: [TENANT_CONNECTION] },
  { provide: 'CLIENTE_REPOSITORY', useFactory: (dataSource: DataSource) => dataSource?.getRepository(Cliente), inject: [TENANT_CONNECTION] },
  { provide: 'CONTATO_REPOSITORY', useFactory: (dataSource: DataSource) => dataSource?.getRepository(Contato), inject: [TENANT_CONNECTION] },
  { provide: 'ORDEM_VENDA_REPOSITORY', useFactory: (dataSource: DataSource) => dataSource?.getRepository(OrdemVenda), inject: [TENANT_CONNECTION] },
  { provide: 'ITEM_ORDEM_VENDA_REPOSITORY', useFactory: (dataSource: DataSource) => dataSource?.getRepository(ItemOrdemVenda), inject: [TENANT_CONNECTION] },
  { provide: 'ORDEM_COMPRA_REPOSITORY', useFactory: (dataSource: DataSource) => dataSource?.getRepository(OrdemCompra), inject: [TENANT_CONNECTION] },
  { provide: 'ITEM_ORDEM_COMPRA_REPOSITORY', useFactory: (dataSource: DataSource) => dataSource?.getRepository(ItemOrdemCompra), inject: [TENANT_CONNECTION] },
  { provide: 'CONTA_FINANCEIRA_REPOSITORY', useFactory: (dataSource: DataSource) => dataSource?.getRepository(ContaFinanceira), inject: [TENANT_CONNECTION] },
  { provide: 'LANCAMENTO_REPOSITORY', useFactory: (dataSource: DataSource) => dataSource?.getRepository(Lancamento), inject: [TENANT_CONNECTION] },
  { provide: 'CONTA_PAGAR_REPOSITORY', useFactory: (dataSource: DataSource) => dataSource?.getRepository(ContaPagar), inject: [TENANT_CONNECTION] },
  // 3. Adicionar fornecedor para o novo repositório de Contas a Receber
  { provide: 'CONTA_RECEBER_REPOSITORY', useFactory: (dataSource: DataSource) => dataSource?.getRepository(ContaReceber), inject: [TENANT_CONNECTION] },
];

@Global()
@Module({
  providers: [tenantConnectionProvider, ...repositoryProviders],
  exports: [tenantConnectionProvider, ...repositoryProviders],
})
export class TenantModule {}
