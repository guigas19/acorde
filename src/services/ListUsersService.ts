import { getRepository } from 'typeorm';
import User from '../models/User';

class ListUsersService {
  public async excute(): Promise<User[]> {
    const userRepository = getRepository(User);

    const users = await userRepository.find();

    users.map(user => delete user.password);

    return users;
  }
}

export default ListUsersService;
