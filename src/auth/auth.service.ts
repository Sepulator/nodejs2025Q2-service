import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Tokens } from './types/tokens.interface';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';

const saltOrRounds = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(createAuthDto: CreateAuthDto): Promise<Omit<User, 'password'>> {
    const { login, password } = createAuthDto;

    const existingUser = await this.userService.findUserByLogin(login);

    if (existingUser) {
      throw new ConflictException('User with this login already exists');
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(this.configService.get<string>('CRYPT_SALT'), 10) || saltOrRounds,
    );

    const newUser = await this.userService.create({
      login,
      password: hashedPassword,
    });

    return newUser;
  }

  async login(createAuthDto: CreateAuthDto): Promise<Tokens> {
    const { login, password } = createAuthDto;
    const user = await this.userService.findUserByLogin(login);

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ForbiddenException('Wrong password');
    }

    return this.getTokens(user.id, user.login);
  }

  async getTokens(userId: string, login: string): Promise<Tokens> {
    const payload = { sub: userId, login };

    const jwtSignOptionsAccess: JwtSignOptions = {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
      expiresIn: this.configService.get<string>('TOKEN_EXPIRE_TIME') as StringValue,
    };

    const jwtSignOptionsRefresh: JwtSignOptions = {
      secret: this.configService.get<string>('JWT_SECRET_REFRESH_KEY'),
      expiresIn: this.configService.get<string>('TOKEN_REFRESH_EXPIRE_TIME') as StringValue,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, jwtSignOptionsAccess),
      this.jwtService.signAsync(payload, jwtSignOptionsRefresh),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
