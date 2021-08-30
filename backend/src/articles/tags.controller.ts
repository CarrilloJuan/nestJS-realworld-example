import { Body, Controller, Get, ParseArrayPipe, Post } from '@nestjs/common';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private tagService: TagsService) {}

  @Post()
  create(
    @Body('tags', new ParseArrayPipe({ items: String }))
    tags: string[],
  ) {
    return this.tagService.createTag(tags);
  }

  @Get()
  findTags() {
    return this.tagService.findAll();
  }
}