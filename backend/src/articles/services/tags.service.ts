import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Tag } from '../entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(private connection: Connection) {}

  createTag(tag: string[] | string) {
    if (Array.isArray(tag)) {
      const tags = tag.map((t) => ({
        name: t,
      }));
      return this.connection
        .getRepository(Tag)
        .createQueryBuilder()
        .insert()
        .into(Tag)
        .values([...tags])
        .orIgnore()
        .returning('*')
        .execute();
    }
    return this.connection
      .getRepository(Tag)
      .createQueryBuilder()
      .insert()
      .into(Tag)
      .values({ name: tag })
      .orIgnore()
      .returning('*')
      .execute();
  }

  async findAll() {
    const tags = await this.connection
      .getRepository(Tag)
      .createQueryBuilder()
      .getMany();

    return { tags: tags.map(({ name }) => name) };
  }

  async createOrFoundTag(tagList: string[]) {
    const tags = tagList.map((t) => ({
      name: t,
    }));

    const { raw: result } = await this.connection
      .getRepository(Tag)
      .createQueryBuilder()
      .insert()
      .into(Tag)
      .values([...tags])
      .orIgnore()
      .returning('*')
      .execute();

    const mergedTagsNames = [...tagList, ...result.map(({ name }) => name)];
    const mergedNamesWithoutDuplicates = [...new Set(mergedTagsNames)];

    const tagsFoundPromises: Promise<Tag>[] = mergedNamesWithoutDuplicates.map(
      (tag) =>
        this.connection
          .getRepository(Tag)
          .createQueryBuilder('tag')
          .where('tag.name = :tag', { tag })
          .getOneOrFail(),
    );

    return Promise.all(tagsFoundPromises);
  }
}
