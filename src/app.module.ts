import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './modules/auth/auth.controller';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/users/users.module';
import { ConfigService } from '@nestjs/config';
import { LoggerModule } from './modules/logger/logger.module';
import { blackListInterceptor, httpExceptionFilter } from './shared/config/provider/except-interceptor.provider';
import { RedisModule } from './modules/redis/redis.module';
import { cacheModuleInstance } from './shared/config/redis-om.config';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    cacheModuleInstance,
    AuthModule,
    UserModule,
    ProductModule,
    DatabaseModule,
    LoggerModule,
    RedisModule
  ],
  controllers: [AuthController],
  providers: [
    blackListInterceptor,
    httpExceptionFilter,
    ConfigService
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
  }
}
