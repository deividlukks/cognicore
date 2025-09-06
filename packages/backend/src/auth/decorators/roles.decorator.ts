// ==============================================================================
// Decorador @Roles
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: Decorador para definir as funções (roles) necessárias para aceder
//            a um determinado endpoint.
// ==============================================================================

import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
