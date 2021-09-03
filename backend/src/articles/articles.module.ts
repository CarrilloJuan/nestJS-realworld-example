import { Module } from '@nestjs/common';
import { ArticlesService } from './services/articles.service';
import { ArticlesController } from './controllers/articles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { UsersModule } from 'src/users/users.module';
import { TagsController } from './controllers/tags.controller';
import { TagsService } from './services/tags.service';
import { Tag } from './entities/tag.entity';
import { CommentsController } from './controllers/comments.controller';
import { Comment } from './entities/comment.entity';
import { CommentsService } from './services/comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Tag, Comment]), UsersModule],
  controllers: [ArticlesController, TagsController, CommentsController],
  providers: [ArticlesService, TagsService, CommentsService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
