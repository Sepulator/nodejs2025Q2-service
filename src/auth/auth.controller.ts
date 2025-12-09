import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { User } from 'src/user/entities/user.entity';
import { Tokens } from './types/tokens.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() createAuthDto: CreateAuthDto): Promise<Omit<User, 'password'>> {
    return await this.authService.signup(createAuthDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() createAuthDto: CreateAuthDto): Promise<Tokens> {
    return await this.authService.login(createAuthDto);
  }
}
