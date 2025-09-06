// ==============================================================================
// Ponto de Entrada (Main) - Aplicação Backend
// Autor: Deivid Lucas
// Versão: 1.2
// Descrição: Adicionada configuração explícita de CORS para permitir
//            requisições do ambiente de desenvolvimento do frontend.
// ==============================================================================
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita o uso de DTOs e validações automáticas globalmente
  app.useGlobalPipes(new ValidationPipe());

  // --- ALTERE ESTA PARTE ---
  // Habilita o CORS de forma explícita para o frontend em desenvolvimento
  app.enableCors({
    origin: 'http://localhost:3001', // A URL exata do seu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // -------------------------

  const port = process.env.PORT || 3000;
  
  await app.listen(port);
  console.log(`🚀 Backend is running on: http://localhost:${port}`);
}
bootstrap();