import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

  @Get('user/:email') 
  getUser(@Param("email") email): Like[] {
    return this.likeService.getLikeForUser(email);
  }
}
