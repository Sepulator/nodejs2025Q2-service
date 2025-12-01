import { User } from '@prisma/client';
import { User as UserInterface } from 'src/user/entities/user.entity';

export const convertUserDate = (user: User): Omit<UserInterface, 'password'> => {
  const { password: _, ...newUser } = user;

  return {
    ...newUser,
    createdAt: user.createdAt.getTime(),
    updatedAt: user.updatedAt.getTime(),
  };
};
