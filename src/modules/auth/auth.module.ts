import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './repository/local.strategy';
import { UserModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt/jwt-secret.constant';
import { JwtStrategy } from './jwt/jwt-strategy';
import { DatabaseModule } from '../database/database.module';
import { blackListInterceptor } from 'src/shared/config/provider/except-interceptor.provider';
import { cacheModuleInstance } from 'src/shared/config/redis-om.config';
import { Role } from 'src/entities/auth/Role.entity';
import { roleRepository, userRepository } from 'src/shared/config/provider/repository.database.provider';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '10d' }
    }),
    cacheModuleInstance,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    userRepository,
    blackListInterceptor,
    roleRepository,
    userRepository,
    {
      provide: 'Role',
      useValue: Role
    }
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }
