import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Body,
  Req,
  UnauthorizedException,
  Delete,
  Param,
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
  async getFeed() {
    return this.postsService.getFeed();
  }

  @Get(':id')
  async getPost(@Param('id') id: string) {
    const post = this.postsService.getPostById(parseInt(id, 10));
    if (!post) throw new BadRequestException('Post not found');
    return post;
  }

  @Post()
  async create(@Body() body: { content?: string; imageUrl?: string }, @Req() req: any) {
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
    const uid = payload?.id ?? '0';

    return this.postsService.createPost({ content, authorEmail, uid, imageUrl: body.imageUrl });
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    this.postsService.deletePost({id: parseInt(id, 10)})
  }

  @Post(':id/comments')
  async createComment(@Param('id') id: string, @Body() body: { text?: string }, @Req() req: any) {
    const text = (body.text ?? '').trim();
    if (!text) throw new BadRequestException('Text cannot be empty');

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
    const postId = parseInt(id, 10);

    const comment = this.postsService.createComment(postId, { text, authorEmail });
    return comment;
  }
}