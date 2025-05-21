import {
  CacheModule,
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { blackListInterceptor } from 'src/shared/config/provider/except-interceptor.provider';
import { ProductRepository } from 'src/repositories/product/product.repository';
import {
  categoryRepository,
  productLikeRepository,
  productRepository,
} from 'src/shared/config/provider/repository.database.provider';

@Module({
  imports: [
    DatabaseModule,
    CacheModule.register({
      imports: [AuthModule],
      inject: [ConfigService],
      stores: redisStore,
    }),
    forwardRef(() => AuthModule),
  ],
  providers: [
    blackListInterceptor,
    ProductService,
    productRepository,
    categoryRepository,
    productLikeRepository
  ],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) { }
}
