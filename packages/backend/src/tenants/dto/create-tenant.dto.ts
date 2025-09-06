// ==============================================================================
// DTO - Create Tenant
// Autor: Deivid Lucas
// Versão: 1.1
// Descrição: Adicionada a propriedade opcional 'isMaster' para permitir a
//            criação do tenant principal da plataforma.
// ==============================================================================

import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  subdomain: string;

  // Adicionando a propriedade opcional isMaster
  @IsBoolean()
  @IsOptional()
  isMaster?: boolean;
}