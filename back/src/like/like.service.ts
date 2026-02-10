import { Injectable } from '@nestjs/common';

export type Like = {
  likeId: number;      // unique like identifier
  id: number;          // post id
  content: string;
  authorEmail: string; // user email
  createdAt: string;
};

@Injectable()
export class LikeService {
  private likes: Like[] = [];

  getFeed(): Like[] {
    return this.likes;
  }

  toggleLike(
    post: Omit<Like, 'likeId' | 'createdAt'>
  ): { liked: boolean; like?: Like } {
    // check if this user already liked THIS post
    const existingIndex = this.likes.findIndex(
      (l) => l.id === post.id && l.authorEmail === post.authorEmail
    );

    if (existingIndex !== -1) {
      // unlike
      this.likes.splice(existingIndex, 1);
      return { liked: false };
    }

    // like
    const like: Like = {
      likeId: Date.now(),
      createdAt: new Date().toISOString(),
      ...post,
    };

    this.likes.push(like);
    return { liked: true, like };
  }
}