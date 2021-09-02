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

  async create(userId: string, slug: string, commentData: CreateCommentDto) {
    const newComment = this.commentsRepository.create(commentData);
    const author = await this.usersService.findOneOrFail(userId);

    const article = await this.articlesService.findOneOrFail({
      where: { slug },
    });
    newComment.author = author;
    newComment.article = article;

    return this.commentsRepository.save(newComment);
  }

  findAll() {
    return this.commentsRepository.find({
      relations: ['article', 'author'],
    });
  }

  findOne(id: number) {
    return this.commentsRepository.findOne(id);
  }

  remove(id: number) {
    return this.commentsRepository.delete(id);
  }
}
