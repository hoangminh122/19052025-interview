import {
  Controller,
  Get,
  UseGuards,
  Param,
  Body,
  Delete,
  Put,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Post } from '@nestjs/common/decorators';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { QueryUserInput } from './dto/query-user.input';
import { MemberMicroDTO, UserUpdateDTO, UserWithTokenMicroDTO } from './dto/user.dto';
import { UserService } from './users.service';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  @Get()
  // @UseInterceptors(BlackListInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getAllUser(@Query() queryUserDto: QueryUserInput) {
    return this.userService.getAll(queryUserDto);
  }

  @Get('GetById/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  showUserById(@Param('id', new ParseUUIDPipe()) id: string) {
   return this.userService.findById(id);
  
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  destroyUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.destroy(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UserUpdateDTO
  ) {
    return this.userService.update(id, data);
  }

  @Post('clean-all-cache-redis')
  @UseGuards(JwtAuthGuard)
  async cleanAllCacheRedis() {
    return this.userService.cleanAllCacheRedis();
  }

  @Post('sync-user-redis-to-db')
  @UseGuards(JwtAuthGuard)
  async syncUserRedisToDb() {
    return this.userService.syncUserRedisToDb();
  }

  @MessagePattern({ cmd: 'get-user' })
  async getUser(@Payload() data: UserWithTokenMicroDTO, @Ctx() context: RmqContext) {
    //Verify token
    const user = await this.authService.verifyFromChat({
      socketUserId:data.socketUserId,
      token: data.token
    });
    return this.userService.findById(user.id);
  }
  
  @MessagePattern({ cmd: 'check-existed-user' })
  async isExistedUser(@Payload() data: { userIds: string[] }, @Ctx() context: RmqContext) {
    // Not Verify token
    return this.userService.isExistedUser(data.userIds);
  }

  @MessagePattern({ cmd: 'check-existed-socket-id-of-member' })
  async isExistedSocketId(@Payload() data: MemberMicroDTO, @Ctx() context: RmqContext) {
    // Not Verify token
    return this.userService.isExistedSocketId(data.memberId, data.socketId);
  }

}
