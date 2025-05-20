import {
  Controller,
  Post,
  Request,
  Body,
  Param,
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
import { Get } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import { AuthenticateUserChatDto } from './dto/authenticate-user-chat.dto';
import { RegisterDTO } from './dto/register.dto';
import { RoleCreateDTO } from './dto/role-create.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // @UseGuards(AuthGuard('local'))
  // @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiResponse({ status: 200, description: 'Login user' })
  async login(@Body() user: AuthDTO) {
    return this.authService.login(user);
  }

  @Post('register')
  @ApiResponse({ status: 201, description: 'Create new user' })
  async register(@Body() user: RegisterDTO) {
    return this.authService.register(user);
  }


  @Get('roles/:user_id')
  @ApiResponse({ status: 200, description: 'Get user role' })
  async getUserRole(@Param('user_id', new ParseUUIDPipe()) userId: string) {
    return this.authService.getUserRole(userId);
  }

  @Get('roles')
  @ApiResponse({ status: 200, description: 'Get all role' })
  async getAllRole() {
    return this.authService.getAllRole();
  }

  @Post('roles/:user_id')
  @ApiResponse({ status: 200, description: 'Set Roles' })
  async setRole(
    @Param('user_id', new ParseUUIDPipe()) userId: string,
    @Body() data: RoleCreateDTO
  ) {
    return this.authService.setRole(userId, data);
  }

  @MessagePattern({ cmd: 'auth-user-chat' })
  // @UseGuards(JwtAuthGuard)
  async verifyFromChat(@Payload() data: AuthenticateUserChatDto, @Ctx() context: RmqContext, @Req() req?: Request) {
    return this.authService.verifyFromChat(data, context);
  }

  @MessagePattern({ cmd: 'validate-token' })
  async validateToken(@Payload() data: { token: string }, @Ctx() context: RmqContext, @Req() req?: Request) {
    return this.authService.validateToken(data);
  }

  // @Post('logout/:id')
  // @UseInterceptors(BlackListInterceptor)
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @ApiResponse({ status: 200, description: 'Logout' })
  // async logout(
  //   @Param('id', new ParseUUIDPipe()) id: string,
  //   @Headers('Authorization') token: string
  // ) {
  //   return this.authService.logout(id, token);
  // }
}
