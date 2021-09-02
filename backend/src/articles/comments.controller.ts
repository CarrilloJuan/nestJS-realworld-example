import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUserDecorator } from 'src/users/current-user.decorator';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

import { CurrentUser } from '../auth/models/current-user';
import { TransformCommentResponse } from './transform-comment-response.interceptor';

@ApiTags('Articles')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(TransformCommentResponse)
@UseGuards(JwtAuthGuard)
@Controller('articles')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':slug/comments')
  create(
    @Param('slug') slug: string,
    @CurrentUserDecorator() currentUser: CurrentUser,
    @Body('comment') createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(
      currentUser.userId,
      slug,
      createCommentDto,
    );
  }

  @Get(':slug/comments')
  findAllComments() {
    return this.commentsService.findAll();
  }

  @Get('comments/:id')
  findOne(@Param('id') id: number) {
    return this.commentsService.findOne(id);
  }

  @Delete(':slug/comments/:id')
  remove(@Param('id') id: number) {
    return this.commentsService.remove(id);
  }
}
