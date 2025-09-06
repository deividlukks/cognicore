import { IsUrl, IsInt, Min, IsOptional } from 'class-validator';

export class ImagemProdutoDto {
  @IsUrl()
  url: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  ordem?: number;
}
