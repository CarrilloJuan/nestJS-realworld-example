import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Connection, Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticlesService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    private connection: Connection,
  ) {}

  async create(userId: string, createArticleDto: CreateArticleDto) {
    const newArticle = this.articlesRepository.create(createArticleDto);
    const author = await this.usersService.findOneOrFail(userId);
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
      relations: ['author', 'favoritedUsers'],
    });
  }

  findOneOrFail(id: string) {
    return this.articlesRepository.findOneOrFail(id);
  }

  update(id: string, updateArticleDto: UpdateArticleDto) {
    return this.articlesRepository.update(id, updateArticleDto);
  }

  async remove(id: string) {
    return this.articlesRepository.delete(id);
  }

  async favoriteArticle(slug: string, userId: string) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.findOneOrFail(User, {
        relations: ['favoriteArticles'],
        where: [{ id: userId }],
      });

      const isFavoriteArticle = user.favoriteArticles.find(
        (article) => article.slug === slug,
      );

      if (!isFavoriteArticle) {
        const article = await queryRunner.manager.findOneOrFail(Article, {
          relations: ['favoritedUsers'],
          where: { slug },
        });
        article.favoritedUsers.push(user);
        user.favoriteArticles.push(article);
        await queryRunner.manager.save(article);
        await queryRunner.manager.save(user);
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async unFavoriteArticle(slug: string, userId: string) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.findOneOrFail(User, {
        relations: ['favoriteArticles'],
        where: [{ id: userId }],
      });

      const isFavoriteArticle = user.favoriteArticles.find(
        (article) => article.slug === slug,
      );

      if (isFavoriteArticle) {
        const article = await queryRunner.manager.findOneOrFail(Article, {
          relations: ['favoritedUsers'],
          where: { slug },
        });
        article.favoritedUsers = article.favoritedUsers.filter(
          (user) => user.id !== userId,
        );

        user.favoriteArticles = user.favoriteArticles.filter(
          (article) => article.slug !== slug,
        );

        await queryRunner.manager.save(article);
        await queryRunner.manager.save(user);
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
