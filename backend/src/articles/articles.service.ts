import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
  ) {}

  async create(userId: number, createArticleDto: CreateArticleDto) {
    // TODO: Check if exits
    const newArticle = this.articlesRepository.create(createArticleDto);
    // TODO: call to userServices instead of repository
    const author = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id'],
    });
    if (author) {
      newArticle.author = author;
    }
    return this.articlesRepository.save(newArticle);
  }

  findAll() {
    return this.articlesRepository.find({ relations: ['author'] });
  }

  findOne(id: string) {
    return this.articlesRepository.findOne({
      where: { slug: id },
      relations: ['author'],
    });
  }

  findOneOrFail(id: string) {
    return this.articlesRepository.findOneOrFail(id);
  }

  update(id: string, updateArticleDto: UpdateArticleDto) {
    return this.articlesRepository.update(id, updateArticleDto);
  }

  remove(id: string) {
    return this.articlesRepository.delete(id);
  }
}
