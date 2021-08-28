import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUserDecorator } from 'src/users/current-user.decorator';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

import { CurrentUser } from '../auth/models/current-user';
import { TransformCommentResponse } from './transform-comment-response.interceptor';

@Controller('articles')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseInterceptors(TransformCommentResponse)
  @UseGuards(JwtAuthGuard)
  @Post(':slug/comments')
  create(
    @Param('slug') articleId: string,
    @CurrentUserDecorator() currentUser: CurrentUser,
    @Body('comment') createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(
      currentUser.userId,
      articleId,
      createCommentDto,
    );
  }

  @UseInterceptors(TransformCommentResponse)
  @UseGuards(JwtAuthGuard)
  @Get(':slug/comments')
  findAll() {
    return this.commentsService.findAll();
  }

  @UseInterceptors(TransformCommentResponse)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.commentsService.findOne(id);
  }

  @UseInterceptors(TransformCommentResponse)
  @UseGuards(JwtAuthGuard)
  @Delete(':slug/comments/:id')
  remove(@Param('id') id: number) {
    return this.commentsService.remove(id);
  }
}
