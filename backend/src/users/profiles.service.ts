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

  async findOne(username: string, currentUserId) {
    return this.connection
      .getRepository(Profile)
      .createQueryBuilder('profile')
      .leftJoinAndMapOne(
        'profile.following',
        'profile.followedUsers',
        'followedUsers',
        'followedUsers.id IN (:...usersId)',
        {
          usersId: [currentUserId],
        },
      )
      .leftJoinAndSelect('profile.user', 'user')
      .where('user.username= :username', { username })
      .getOneOrFail();
  }

  async followUser(username: string, currentUserId: string) {
    const userToFollow = await this.userRepository.findOneOrFail({
      where: { username },
    });

    const profileToFollow = await this.profileRepository.findOneOrFail({
      relations: ['followedUsers', 'user'],
      where: { id: userToFollow.profileId },
    });

    const currentUser = await this.userRepository.findOneOrFail(currentUserId, {
      relations: ['followedProfiles'],
    });

    const isFollowed = currentUser.followedProfiles.find(
      (followedProfile) => followedProfile.id === profileToFollow.id,
    );

    if (!isFollowed) {
      await this.connection
        .getRepository(User)
        .createQueryBuilder()
        .relation(User, 'followedProfiles')
        .of(currentUser)
        .add(profileToFollow);
    }

    const parsedProfile = classToPlain(profileToFollow);
    return { ...parsedProfile, following: true };
  }

  async unFollowUser(username: string, currentUserId: string) {
    const userToUnFollow = await this.userRepository.findOneOrFail({
      where: { username },
    });
    const profileToUnfollow = await this.profileRepository.findOneOrFail({
      relations: ['followedUsers', 'user'],
      where: { id: userToUnFollow.profileId },
    });

    const userFollowingProfile = await this.connection
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId: currentUserId })
      .leftJoinAndSelect('user.followedProfiles', 'followedProfiles')
      .andWhere('followedProfiles.id = :profileToUnfollowId', {
        profileToUnfollowId: profileToUnfollow.id,
      })
      .getOne();

    if (userFollowingProfile) {
      await this.connection
        .getRepository(User)
        .createQueryBuilder()
        .relation(User, 'followedProfiles')
        .of(userFollowingProfile)
        .remove(profileToUnfollow);
    }

    const parsedProfile = classToPlain(profileToUnfollow);
    return { ...parsedProfile, following: false };
  }
}
