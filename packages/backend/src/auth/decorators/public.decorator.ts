// ==============================================================================
// Decorador - @Public
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: Um decorador personalizado para marcar um endpoint como público,
//            permitindo que ele seja acedido sem autenticação JWT, mesmo
//            quando um guarda global está ativo.
// ==============================================================================
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
