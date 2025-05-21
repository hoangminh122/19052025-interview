import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SortType } from 'src/shared/enums/common.enum';
import { PaginitionModel } from 'src/shared/paginate/paginition-model';

export class QueryProductInput extends PaginitionModel {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional()
  @IsOptional()
  sortBy: string;

  @ApiPropertyOptional({
    enum: SortType,
  })
  @IsOptional()
  @IsEnum(SortType)
  sortType?: SortType;
}
