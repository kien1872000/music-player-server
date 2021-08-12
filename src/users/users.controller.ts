import { Body, Controller, Get, Request, Param, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { LocalAuthGuard } from "src/auth/local.authguard";
import { UserLogin } from "src/dto/login.dto";
import { UserSignUp } from "src/dto/userSignUp.dto";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "src/auth/jwt.authguard";
import { AuthService } from "src/auth/auth.service";
import { MailService } from "src/mail/mail.service";
import { Query } from "@nestjs/common";
@ApiTags('User')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private mailService: MailService
  ) {}
  @Post('signUp')
  @ApiOperation({ description: 'Register an account' })
  @ApiBody({ type: UserSignUp })
  async signUp(@Body() userSignUp: UserSignUp) {
    return this.usersService.signUp(userSignUp);
  }
  @UseGuards(JwtAuthGuard)
  @Get('user/info')
  async getUserInfoById(@Request() req) {

    return this.usersService.getUserInfoById(req.user.userId);
  }
  @ApiQuery({ type: String, name: 'email', required: true })
  @UseGuards(JwtAuthGuard)
  @Post('user/send-mail') 
  async sendMailToUser(@Query('email') email: string) {

    return this.mailService.sendConfirmationEmail(email, '123');
  }
}

@ApiTags('Login')
@Controller('users')
export class UserLoginController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ description: 'Login with an account' })
  @ApiBody({ type: UserLogin })
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}