import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LikeService, Like } from './like.service';

@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Get()
  async getFeed(): Promise<Like[]> {
    return await this.likeService.getFeed();
  }

  @Post('toggle')
  async toggleLike(@Body() post: Omit<Like, "likeId" | "createdAt">) {
    return await this.likeService.toggleLike(post);
  }

  @Get('user/:email') 
  async getUser(@Param("email") email): Promise<Like[]> {
    return await this.likeService.getLikeForUser(email);
  }
}
