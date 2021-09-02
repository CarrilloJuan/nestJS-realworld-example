import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/models/current-user';
import { CurrentUserDecorator } from './current-user.decorator';
import { ProfilesService } from './profiles.service';
import { TransformerProfileResponse } from './transform-profile-response.interceptor';

@ApiTags('Profiles')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(TransformerProfileResponse)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  async findProfile(
    @Param('username') username: string,
    @CurrentUserDecorator() currentUser: CurrentUser,
  ) {
    return this.profilesService.findOne(username, currentUser.userId);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post(':username/follow')
  favoriteArticle(
    @Param('username') username: string,
    @CurrentUserDecorator() currentUser: CurrentUser,
  ) {
    return this.profilesService.followUser(username, currentUser.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':username/follow')
  unfavoriteArticle(
    @Param('username') username: string,
    @CurrentUserDecorator() currentUser: CurrentUser,
  ) {
    return this.profilesService.unFollowUser(username, currentUser.userId);
  }
}
