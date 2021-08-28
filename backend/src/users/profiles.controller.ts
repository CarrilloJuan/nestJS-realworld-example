import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/models/current-user';
import { CurrentUserDecorator } from './current-user.decorator';
import { ProfilesService } from './profiles.service';
import { TransformerProfileResponse } from './transform-profile-response.interceptor';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}
  @SerializeOptions({
    groups: ['profile'],
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(TransformerProfileResponse)
  @UseGuards(JwtAuthGuard)
  @Get(':username')
  async findProfile(@Param('username') username: string) {
    return this.profilesService.findOne(username);
  }

  @UseGuards(JwtAuthGuard)
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
