import {
  Controller,
  Request
} from '@nestjs/common';
import { Body, Get, Param, Post, Query, UseGuards } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { QueryProductInput } from './dto/query-product.input';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';

@ApiTags('products')
@Controller('products')
@ApiBearerAuth()
export class ProductController {
  constructor(
    private productService: ProductService,
  ) { }

  @Get()
  async getAllProducts(@Query() queryProductDto: QueryProductInput) {
    return this.productService.getPaginatedProducts(queryProductDto);
  }

  @Post()
  // @UseGuards(JwtAuthGuard)
  async cleanAllCacheRedis(@Body() payload: CreateProductDto) {
    return this.productService.create(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async toggleLike(@Param('id') productId: number, @Request() req) {
    const userId = req.user.userId;
    return this.productService.toggleLike(productId, userId);
  }

}
