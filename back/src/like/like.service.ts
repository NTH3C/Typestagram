import { Injectable } from '@nestjs/common';

export type Like = {
  id: number;
  content: string;
  authorEmail: string;
  createdAt: string;
  uid: string;
};

@Injectable()
export class LikeService {
  private likes: Like[] = [];

  getFeed(): Like[] {
    return this.likes;
  }

  likePost(post: Omit<Like, 'id'>): Like {
    const like: Like = {
      id: Date.now(),
      ...post,
    };

    this.likes.push(like);

    return like;
  }
}
