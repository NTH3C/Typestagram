import { Body, Controller, Get, Post } from '@nestjs/common';
import * as likeService from './like.service';

@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: likeService.LikeService) {}

  @Get()
  getFeed(): likeService.Like[] {
    return this.likeService.getFeed();
  }

  @Post()
  likePost(@Body() post: Omit<likeService.Like, 'id'>): likeService.Like {
    return this.likeService.likePost(post);
  }
}
