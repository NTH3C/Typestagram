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

  toggleLike(post: Omit<Like, 'id'>): { liked: boolean; like?: Like } {
    // check if this user already liked this post
    const existingIndex = this.likes.findIndex(
      (l) => l.uid === post.uid && l.authorEmail === post.authorEmail
    );

    if (existingIndex !== -1) {
      // remove like → dislike
      this.likes.splice(existingIndex, 1);
      return { liked: false };
    }

    // else → add like
    const like: Like = {
      id: Date.now(),
      ...post,
    };
    this.likes.push(like);
    return { liked: true, like };
  }
}
