import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import AppError from '../errors/AppError';

import User from '../models/User';

interface UserDto {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: UserDto): Promise<User> {
    const usersRepository = getRepository(User);

    const checkEmailExist = await usersRepository.findOne({
      where: { email },
    });

    if (checkEmailExist) throw new AppError('Email adress already used');

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await usersRepository.save(user);

    delete user.password;

    return user;
  }
}

export default CreateUserService;
