// ==============================================================================
// Controller - UsersController
// Autor: Deivid Lucas
// Versão: 1.0
// Descrição: Expõe os endpoints da API para a gestão de utilizadores,
//            começando com o registo de um novo utilizador.
// ==============================================================================
import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public() // Marcar o registo de utilizadores como público
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
