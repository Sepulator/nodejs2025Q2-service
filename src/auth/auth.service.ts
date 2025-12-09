import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { convertUserDate } from 'src/utils/convert-date';

const saltOrRounds = 10;

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signup(createAuthDto: CreateAuthDto): Promise<Omit<User, 'password'>> {
    const { login, password } = createAuthDto;

    const existingUser = await this.userService.findUserByLogin(login);

    if (existingUser) {
      throw new ConflictException('User with this login already exists');
    }

    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.CRYPT_SALT, 10) || saltOrRounds);

    const newUser = await this.userService.create({
      login,
      password: hashedPassword,
    });

    return newUser;
  }

  async login(createAuthDto: CreateAuthDto): Promise<Omit<User, 'password'>> {
    const { login, password } = createAuthDto;
    const user = await this.userService.findUserByLogin(login);

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ForbiddenException('Wrong password');
    }

    return convertUserDate(user);
  }
}
