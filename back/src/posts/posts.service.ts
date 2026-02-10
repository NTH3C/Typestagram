import { Injectable } from '@nestjs/common';

export type PostModel = {
  id: number;
  content: string;
  authorEmail: string;
  createdAt: string;
};

@Injectable()
export class PostsService {
  private posts: PostModel[] = [];

  getFeed(): PostModel[] {
    return this.posts;
  }

  createPost(input: { content: string; authorEmail: string }): PostModel {
    const post: PostModel = {
      id: Date.now(),
      content: input.content,
      authorEmail: input.authorEmail,
      createdAt: new Date().toISOString(),
    };

    return post;
  }
}
