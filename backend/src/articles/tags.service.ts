import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Tag } from './entities/tag.entity';

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
        .execute();
    }
    return this.connection
      .getRepository(Tag)
      .createQueryBuilder()
      .insert()
      .into(Tag)
      .values({ name: tag })
      .execute();
  }

  async findAll() {
    const tags = await this.connection
      .getRepository(Tag)
      .createQueryBuilder()
      .getMany();

    return { tags: tags.map(({ name }) => name) };
  }
}
