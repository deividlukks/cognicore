import { IsString, IsNotEmpty } from 'class-validator';

export class VariacaoDto {
  @IsString()
  @IsNotEmpty()
  nomeAtributo: string;

  @IsString()
  @IsNotEmpty()
  opcao: string;
}
