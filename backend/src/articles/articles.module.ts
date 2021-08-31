import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { UsersModule } from 'src/users/users.module';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { Tag } from './entities/tag.entity';
import { CommentsController } from './comments.controller';
import { Comment } from './entities/comment.entity';
import { CommentsService } from './comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Tag, Comment]), UsersModule],
  controllers: [ArticlesController, TagsController, CommentsController],
  providers: [ArticlesService, TagsService, CommentsService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
