import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticlesService } from 'src/articles/articles.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private usersService: UsersService,
    private articlesService: ArticlesService,
  ) {}

  async create(
    userId: string,
    articleId: string,
    commentData: CreateCommentDto,
  ) {
    const newComment = this.commentsRepository.create(commentData);
    const autor = await this.usersService.findOneOrFail(userId);

    const article = await this.articlesService.findOneOrFail(articleId);
    newComment.autor = autor;
    newComment.article = article;
    return this.commentsRepository.save(newComment);
  }

  findAll() {
    return this.commentsRepository.find({
      relations: ['article', 'autor'],
    });
  }

  findOne(id: number) {
    return this.commentsRepository.findOne(id);
  }

  remove(id: number) {
    return this.commentsRepository.delete(id);
  }
}
