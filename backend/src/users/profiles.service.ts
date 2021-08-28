import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { classToPlain } from 'class-transformer';
import { Connection, Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { User } from './entities/user.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private connection: Connection,
  ) {}

  findOne(username: string) {
    return this.profileRepository.findOneOrFail({
      where: { username },
    });
  }

  async followUser(username: string, currentUserId: string) {
    const profile = await this.profileRepository.findOneOrFail({
      where: { username },
      relations: ['followedUsers'],
    });
    const user = await this.userRepository.findOneOrFail(currentUserId, {
      relations: ['followedProfiles'],
    });

    const isFollowed = user.followedProfiles.find(
      (followedProfile) => followedProfile.id === profile.id,
    );
    await this.connection.transaction(async (manager) => {
      if (!isFollowed) {
        user.followedProfiles.push(profile);
        profile.followedUsers.push(user);
        await manager.save(user);
        await manager.save(profile);
      }
    });
    const parsedProfile = classToPlain(profile);
    return { ...parsedProfile, following: true };
  }

  async unFollowUser(username: string, currentUserId: string) {
    const profile = await this.profileRepository.findOneOrFail({
      relations: ['followedUsers'],
      where: { username },
    });

    const userFollowingProfile = await this.connection
      .getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.followedProfiles', 'followedProfiles')
      .where('user.id = :userId', { userId: currentUserId })
      .andWhere('followedProfiles.username = :username', { username })
      .getOne();

    if (userFollowingProfile) {
      await this.connection
        .getRepository(User)
        .createQueryBuilder()
        .relation(User, 'followedProfiles')
        .of(userFollowingProfile)
        .remove(profile);
    }

    const parsedProfile = classToPlain(profile);
    return { ...parsedProfile, following: false };
  }
}
