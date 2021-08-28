import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  findOne(username: string) {
    return this.profileRepository.findOneOrFail({
      where: { username },
    });
  }

  followUser(username: string, currentUserId: string) {}

  unFollowUser(username: string, currentUserId: string) {}
}
