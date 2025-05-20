import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/users.service';
import { Cache } from 'cache-manager';
import { ISuccessResponse } from 'src/shared/utils/response/interface/success-res.interface';
import { IResponse } from 'src/shared/utils/response/interface/response.interface';
import { MessageError } from 'src/shared/utils/response/sys-res.system';
import { AuthDTO } from './dto/auth.dto';
import { UserDTO } from '../users/dto/user.dto';
import { RegisterDTO } from './dto/register.dto';
import { comparePassword } from 'src/shared/utils/bcrypt';
import { UserGenericRepository } from 'src/repositories/user/user-postgres.repository';
import { RoleGenericRepository } from 'src/repositories/auth/role-postgres.repository';
import { REPOSITORY_NAME } from 'src/shared/constant/repository-config.constant';
import { RoleCreateDTO } from './dto/role-create.dto';
import { AuthenticateUserChatDto } from './dto/authenticate-user-chat.dto';
import { RmqContext } from '@nestjs/microservices';
import { jwtConstants } from './jwt/jwt-secret.constant';
import { UserEntity } from 'src/entities/redis-om/User.redis-entity';
import { Role } from 'src/entities/auth/Role.entity';
import { User } from 'src/entities/auth/User.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject(REPOSITORY_NAME.USER_REPOSITORY)
    private userRepository: UserGenericRepository,
    @Inject(REPOSITORY_NAME.ROLE_REPOSITORY)
    private roleRepository: RoleGenericRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async validateUser({ email, password }: AuthDTO): Promise<UserEntity> {
    const user = await this.userService.findUser(email);
    if (!user)
      throw new HttpException(
        {
          success: false,
          message: MessageError.NOT_FOUND
        },
        HttpStatus.NOT_FOUND,
      );
    const isEqual = await comparePassword(password, user.password);
    if (!isEqual)
      throw new HttpException(
        {
          success: false,
          message: MessageError.PASSWORD_FAIL
        },
        HttpStatus.BAD_REQUEST,
      );
    // user.setDataValue('password', undefined);
    delete user[password]
    return user;
  }

  async login(userInput: AuthDTO): Promise<{ access_token: string }> {
    const user = await this.validateUser(userInput);
    const payload = { email: userInput.email, id: user._id };
    return {
      access_token: await this.jwtService.sign(payload),
    };
  }

  async register(userRegister: RegisterDTO): Promise<IResponse> {
    const isCheckExist = await this.userService.isUserExisted(
      userRegister.email,
      userRegister.username,
      userRegister.phone
    );
    if (isCheckExist) {
      throw new HttpException(
        {
          success: false,
          message: MessageError.USERNAME_OR_EMAIL_EXISTED
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const userNew = await this.userService.create(userRegister as UserDTO);

    //Hide pass 
    // userNew.password = undefined;
    delete userNew['password'];
    const result: IResponse = {
      success: true,
      result: userNew
    } as ISuccessResponse;

    return result;
  }

  async getUserRole(userId: string): Promise<IResponse> {
    const userFind = await this.userRepository.findOne(
      { id: userId },
      { include: [{ model: Role }] }
    );

    const result: ISuccessResponse = {
      success: true,
      result: userFind?.roles || []
    };
    return result;
  }

  async verifyFromChat(data: AuthenticateUserChatDto, context?: RmqContext): Promise<User> {
    const token = data.token.split(" ")
    const tokenJson = this.jwtService.verify(token[1], { secret: jwtConstants.secret });
    await this.userService.updateRedisOm(tokenJson.id, { socketIds: [data.socketUserId] });
    return tokenJson;
  }

  async validateToken(data: { token: string }): Promise<User> {
    const token = data.token.split(" ");
    return this.jwtService.verify(token[1], { secret: jwtConstants.secret });
  }

  async getAllRole(): Promise<IResponse> {
    const roles = await this.roleRepository.findAll({});
    const result: ISuccessResponse = {
      success: true,
      result: roles?.rows || []
    };
    return result;
  }

  async setRole(userId: string, data: RoleCreateDTO): Promise<IResponse> {
    const roles = { data };
    const user = await this.userRepository.findOne({ id: userId });
    if (!user)
      throw new HttpException(
        {
          success: false,
          error: 'NOT_FOUND',
        },
        HttpStatus.NOT_FOUND,
      );
    // const roleFinds = await this.roleModel.findAndCountAll({
    //   where:{name: {[Op.in]: [UserTypeRole.PIC_ADMIN]}}
    // });
    // const roleFinds1 = await this.roleRepository.findAll({condition:{ name: {[Op.in]: [UserTypeRole.PIC_ADMIN]}}});

    return;
  }

  // async logout(id: string, token: string) {
  //   let result = null;
  //   try {
  //     return this.unitOfWork.scope(async() => {
  //       //Find user
  //       const user = await this.userRepository.findOne({
  //         where: { id }
  //       });

  //       const tokenClone = token.replace('Bearer ', '');
  //       if(user) {
  //         //Add blacklist
  //         const blacklistCache: any = await this.cacheManager.get(`${CACHE_PREFIX.BLACKLIST_TOKEN}`);
  //         const blacklist = blacklistCache && blacklistCache.length > 0 ? blacklistCache : [];
  //         if(blacklist) {
  //           const isExist = blacklist.some(tokenItem => tokenClone == tokenItem);
  //           if(!isExist) {
  //             blacklist.push(tokenClone)
  //             await this.cacheManager.set(`${CACHE_PREFIX.BLACKLIST_TOKEN}`, blacklist);
  //           }
  //         }
  //         else {
  //           blacklist.push(tokenClone)
  //           await this.cacheManager.set(`${CACHE_PREFIX.BLACKLIST_TOKEN}`, blacklist);
  //         }
  //       }

  //       result = {
  //         success: true,
  //         result: null
  //       } as ISuccessResponse;

  //       return result;
  //     });
  //   } catch (error) {
  //     throw new HttpException(
  //       {
  //         success: false,
  //         error: 'INTERNAL_SERVER_ERROR',
  //       },
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
}
