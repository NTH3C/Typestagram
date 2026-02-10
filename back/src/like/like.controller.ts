import { Body, Controller, Get, Post } from '@nestjs/common';
import { LikeService, Like } from './like.service';

@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Get()
  getFeed(): Like[] {
    return this.likeService.getFeed();
  }

  @Post('toggle')
  toggleLike(@Body() post: Omit<Like, "likeId" | "createdAt">) {
    return this.likeService.toggleLike(post);
  }
}
