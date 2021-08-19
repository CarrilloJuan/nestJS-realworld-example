import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async saveUser(newUserModel) {
    const { password, createAt, updateAt, ...user } = await this.save(
      newUserModel,
    );
    return user;
  }
}
