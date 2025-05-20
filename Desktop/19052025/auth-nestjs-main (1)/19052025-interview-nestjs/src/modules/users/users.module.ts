import { CacheModule, forwardRef, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { userRepository } from 'src/shared/config/provider/repository.database.provider';
import { blackListInterceptor } from 'src/shared/config/provider/except-interceptor.provider';
import { UserRedisOmRepository } from 'src/repositories/user/user-postgres.repository';

@Module({
  imports: [
    DatabaseModule,
    CacheModule.register({
      imports: [AuthModule],
      inject: [ConfigService],
      stores: redisStore
    }),
    forwardRef(() => AuthModule),
  ],
  providers: [
    UserService,
    userRepository,
    blackListInterceptor,
    {
      provide: 'UserRedisOmRepository',
      useClass: UserRedisOmRepository
    }
  ],
  controllers: [UsersController],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(isExistUserMiddleware()).forRoutes(
    //   {path: 'users/*', method: RequestMethod.ALL}
    // )
  }
}
