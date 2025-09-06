// ==============================================================================
// Módulo Principal - AppModule
// Autor: Deivid Lucas
// Versão: 2.9
// Descrição: Corrigido o middleware para excluir também a rota 'auth/login'.
//            Isto garante que a identificação do tenant para o login seja
//            feita pela LocalStrategy (via header) e não pelo subdomínio.
// ==============================================================================
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantsModule } from './tenants/tenants.module';
import { Tenant } from './tenants/entities/tenant.entity';
import { TenantMiddleware } from './middleware/tenant.middleware';
import { EstoqueModule } from './estoque/estoque.module';
import { VendasModule } from './vendas/vendas.module';
import { TenantModule } from './tenant/tenant.module';
import { ComprasModule } from './compras/compras.module';
import { FinanceiroModule } from './financeiro/financeiro.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [Tenant, User],
        synchronize: true,
      }),
    }),
    TenantModule,
    TenantsModule,
    EstoqueModule,
    VendasModule,
    ComprasModule,
    FinanceiroModule,
    AuthModule,
    UsersModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      // Correção: Adicionada a rota 'auth/login' à lista de exclusão
      .exclude(
        { path: 'tenants', method: RequestMethod.POST },
        { path: 'auth/pre-login', method: RequestMethod.POST },
        { path: 'auth/login', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
