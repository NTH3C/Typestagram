import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Body,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  getFeed() {
    return this.postsService.getFeed();
  }

  @Post()
  async create(@Body() body: { content?: string }, @Req() req: any) {
    const content = (body.content ?? '').trim();
    if (!content) throw new BadRequestException('Content cannot be empty');

    const authHeader = req.headers?.authorization as string | undefined;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing token');
    }

    const token = authHeader.slice('Bearer '.length).trim();

    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    const authorEmail = payload?.email ?? 'unknown';

    return this.postsService.createPost({ content, authorEmail });
  }
}
