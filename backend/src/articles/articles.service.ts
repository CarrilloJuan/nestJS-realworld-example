import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { classToPlain } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Connection, Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { Tag } from './entities/tag.entity';

@Injectable()
export class ArticlesService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    private connection: Connection,
  ) {}

  async create(userId: string, createArticleDto: CreateArticleDto) {
    const author = await this.usersService.findOneOrFail(userId);
    const { tagList, ...articleData } = createArticleDto;

    const tags = await this.connection
      .getRepository(Tag)
      .createQueryBuilder('tag')
      .where('tag.name IN (:...tagList)', {
        tagList: [...tagList],
      })
      .getMany();
    const newArticle = this.articlesRepository.create(articleData);
    newArticle.author = author;
    newArticle.tags = [...tags];
    const articleCreated = await this.articlesRepository.save(newArticle);
    return {
      article: classToPlain(articleCreated),
    };
  }

  commomArticlesQueryBuilder = (userId: string) =>
    this.connection
      .getRepository(Article)
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.tags', 'tags')
      .leftJoinAndSelect('author.profile', 'profile')
      .leftJoinAndSelect('author.favoriteArticles', 'favoriteArticles')
      .leftJoinAndMapOne(
        'article.favorited',
        'article.favoritedUsers',
        'favoritedUsers',
        'favoritedUsers.id IN (:...usersId)',
        {
          usersId: [userId],
        },
      )
      .leftJoinAndMapOne(
        'profile.following',
        'profile.followedUsers',
        'followedUsers',
        'followedUsers.id IN (:...usersId)',
        {
          usersId: [userId],
        },
      );

  async findAll(userId: string) {
    const [articles, articlesCount] = await this.commomArticlesQueryBuilder(
      userId,
    ).getManyAndCount();

    return {
      articles: classToPlain(articles),
      articlesCount,
    };
  }

  async findOne(userId: string, articleId: string) {
    const article = await this.commomArticlesQueryBuilder(userId)
      .where({ slug: articleId })
      .getOne();
    return { article: classToPlain(article) };
  }

  findOneOrFail(id: string) {
    return this.articlesRepository.findOneOrFail(id);
  }

  async findByAuthor(author: string, userId: string) {
    const [articles, articlesCount] = await this.commomArticlesQueryBuilder(
      userId,
    )
      .where('author.username = :author', {
        author,
      })
      .getManyAndCount();
    return {
      articles: classToPlain(articles),
      articlesCount,
    };
  }

  async findByTag(tag: string, userId: string) {
    const [articles, articlesCount] = await this.commomArticlesQueryBuilder(
      userId,
    )
      .where('tags.name IN (:...tags)', {
        tags: [tag],
      })
      .getManyAndCount();

    return {
      articles: classToPlain(articles),
      articlesCount,
    };
  }

  async favoritedByUser(user: string, userId: string) {
    const [articles, articlesCount] = await this.commomArticlesQueryBuilder(
      userId,
    )
      .where('favoritedUsers.username IN (:...users)', {
        users: [user],
      })
      .getManyAndCount();

    return {
      articles: classToPlain(articles),
      articlesCount,
    };
  }

  async findByfeed(userId: string) {
    const [articles, articlesCount] = await this.commomArticlesQueryBuilder(
      userId,
    )
      .where('followedUsers.id IN (:...usersId)', {
        usersId: [userId],
      })
      .getManyAndCount();

    return {
      articles: classToPlain(articles),
      articlesCount,
    };
  }

  async update(
    articleId: string,
    updateArticleDto: UpdateArticleDto,
    userId: string,
  ) {
    await this.articlesRepository.update(articleId, updateArticleDto);
    const article = await this.commomArticlesQueryBuilder(userId)
      .where({ slug: articleId })
      .getOne();
    return { article: classToPlain(article) };
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
        article.favoritesCount += 1;
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

        article.favoritesCount -= 1;

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
