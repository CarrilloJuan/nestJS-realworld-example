import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { UsersService } from 'src/users/users.service';
import { ArticlesService } from 'src/articles/articles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), UsersService, ArticlesService],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
