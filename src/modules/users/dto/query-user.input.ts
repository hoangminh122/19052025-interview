import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginitionModel } from 'src/shared/paginate/paginition-model';

export class QueryUserInput extends PaginitionModel {

  @ApiPropertyOptional()
  @IsOptional()
  // @Type(() => Number)
  @IsString()
  readonly name: string;

  @ApiPropertyOptional()
  @IsOptional()
  // @Type(() => Number)
  @IsString()
  readonly email: string;

  @ApiPropertyOptional()
  @IsOptional()
  sortBy: string;

  @ApiPropertyOptional()
  @IsOptional()
  sortType: string;
}
