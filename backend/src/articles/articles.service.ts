import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { classToPlain } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Connection, Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { FindArticle } from './interfaces/find-article';
import { TagsService } from './tags.service';

@Injectable()
export class ArticlesService {
  constructor(
    private usersService: UsersService,
    private tagsService: TagsService,
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    private connection: Connection,
  ) {}

  async create(userId: string, createArticleDto: CreateArticleDto) {
    const author = await this.usersService.findOneOrFail(userId);
    const { tagList = [], ...articleData } = createArticleDto;

    const newArticle = this.articlesRepository.create(articleData);
    newArticle.author = author;

    if (tagList.length > 0) {
      const tags = await this.tagsService.createOrFoundTag(tagList);
      newArticle.tags = tags;
    }

    const articleCreated = await this.articlesRepository.save(newArticle);
    return {
      article: classToPlain(articleCreated),
    };
  }

  commomArticlesQueryBuilder = ({
    userId,
    limit = 20,
    offset = 0,
  }: FindArticle) =>
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
      .loadRelationCountAndMap(
        'article.favoritesCount',
        'article.favoritedUsers',
        'followedUsersCount',
      )
      .leftJoinAndMapOne(
        'profile.following',
        'profile.followedUsers',
        'followedUsers',
        'followedUsers.id IN (:...usersId)',
        {
          usersId: [userId],
        },
      )
      .skip(offset)
      .take(limit);

  async findAll(options: FindArticle) {
    const [articles, articlesCount] = await this.commomArticlesQueryBuilder(
      options,
    ).getManyAndCount();

    return {
      articles: classToPlain(articles),
      articlesCount,
    };
  }

  async findOne(userId: string, articleId: string) {
    const article = await this.commomArticlesQueryBuilder({ userId })
      .where({ slug: articleId })
      .getOne();
    return { article: classToPlain(article) };
  }

  findOneOrFail(query) {
    return this.articlesRepository.findOneOrFail(query);
  }

  async findByAuthor(author: string, options: FindArticle) {
    const [articles, articlesCount] = await this.commomArticlesQueryBuilder(
      options,
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

  async findByTag(tag: string, options: FindArticle) {
    const [articles, articlesCount] = await this.commomArticlesQueryBuilder(
      options,
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

  async favoritedByUser(user: string, options: FindArticle) {
    const [articles, articlesCount] = await this.commomArticlesQueryBuilder(
      options,
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

  async findByfeed(options: FindArticle) {
    const [articles, articlesCount] = await this.commomArticlesQueryBuilder(
      options,
    )
      .where('followedUsers.id IN (:...usersId)', {
        usersId: [options.userId],
      })
      .getManyAndCount();

    return {
      articles: classToPlain(articles),
      articlesCount,
    };
  }

  async update(
    slug: string,
    updateArticleDto: UpdateArticleDto,
    userId: string,
  ) {
    const { tagList = [], ...articleData } = updateArticleDto;

    const { affected: articleUpdated, raw } = await this.connection
      .createQueryBuilder()
      .update(Article)
      .set(articleData)
      .where('slug = :slug', { slug })
      .returning('id')
      .execute();

    if (articleUpdated && tagList.length > 0) {
      const articleUpdatedId = raw[0].id;
      const tagsIds = await this.tagsService.createOrFoundTag(tagList);
      await this.connection
        .createQueryBuilder()
        .relation(Article, 'tags')
        .of(articleUpdatedId)
        .add(tagsIds);
    }

    const article = await this.commomArticlesQueryBuilder({ userId })
      .where({ slug })
      .getOne();

    return { article: classToPlain(article) };
  }

  async remove(id: string) {
    return this.articlesRepository.delete(id);
  }

  async favoriteArticle(slug: string, userId: string) {
    const user = await this.connection.getRepository(User).findOneOrFail({
      relations: ['favoriteArticles'],
      where: [{ id: userId }],
    });

    const isFavoriteArticle = user.favoriteArticles.find(
      (article) => article.slug === slug,
    );

    const article = await this.articlesRepository.findOneOrFail({
      where: { slug },
    });

    if (!isFavoriteArticle) {
      await this.connection
        .createQueryBuilder()
        .relation(Article, 'favoritedUsers')
        .of(article)
        .add(user);
    }

    const favoritedArticle = await this.commomArticlesQueryBuilder({ userId })
      .where({ slug })
      .getOne();
    return { article: classToPlain(favoritedArticle) };
  }

  async unFavoriteArticle(slug: string, userId: string) {
    const user = await this.connection.getRepository(User).findOneOrFail({
      relations: ['favoriteArticles'],
      where: [{ id: userId }],
    });

    const isFavoriteArticle = user.favoriteArticles.find(
      (article) => article.slug === slug,
    );

    const article = await this.commomArticlesQueryBuilder({ userId })
      .where({ slug })
      .getOne();

    if (isFavoriteArticle) {
      await this.connection
        .createQueryBuilder()
        .relation(Article, 'favoritedUsers')
        .of(article)
        .remove(user);
    }

    const unFavoritedArticle = await this.commomArticlesQueryBuilder({ userId })
      .where({ slug })
      .getOne();
    return { article: classToPlain(unFavoritedArticle) };
  }
}
