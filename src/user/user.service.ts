import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { InMemoryDbService } from 'src/db/in-memory-db.service';
import { User } from './entities/user.entity';
import { randomUUID } from 'node:crypto';

@Injectable()
export class UserService {
  constructor(private db: InMemoryDbService) {}

  create(createUserDto: CreateUserDto): Omit<User, 'password'> {
    const now = Date.now();
    const newUser: User = {
      id: randomUUID(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };
    this.db.users.push(newUser);
    const { password: _, ...user } = newUser;
    return user;
  }

  findAll(): Omit<User, 'password'>[] {
    return this.db.users.map(({ password: _, ...user }) => user);
  }

  findOne(id: string): Omit<User, 'password'> {
    const user = this.db.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  update(id: string, updatePasswordDto: UpdatePasswordDto): Omit<User, 'password'> {
    const user = this.db.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Wrong old password');
    }
    user.password = updatePasswordDto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  remove(id: string): void {
    const userIndex = this.db.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }
    this.db.users.splice(userIndex, 1);
    return;
  }
}
