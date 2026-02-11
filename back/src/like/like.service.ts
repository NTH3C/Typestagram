import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

export type Like = {
  likeId: number;      // unique like identifier
  id: number;          // post id
  content: string;
  authorEmail: string; // user email
  createdAt: string;
};

@Injectable()
export class LikeService {
  private filePath = path.join(process.cwd(), 'data', 'likes.json');

  // Lire les likes
  private async readLikes(): Promise<Like[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  // Écrire les likes
  private async writeLikes(likes: Like[]) {
    await fs.writeFile(this.filePath, JSON.stringify(likes, null, 2));
  }

  async getFeed(): Promise<Like[]> {
    return this.readLikes();
  }

  async getLikeForUser(email: string): Promise<Like[]> {
    const likes = await this.readLikes();
    return likes.filter(like => like.authorEmail === email);
  }

  async toggleLike(
    post: Omit<Like, 'likeId' | 'createdAt'>
  ): Promise<{ liked: boolean; like?: Like }> {
    const likes = await this.readLikes();

    // Vérifie si l'utilisateur a déjà liké ce post
    const existingIndex = likes.findIndex(
      (l) => l.id === post.id && l.authorEmail === post.authorEmail
    );

    if (existingIndex !== -1) {
      // unlike
      likes.splice(existingIndex, 1);
      await this.writeLikes(likes);
      return { liked: false };
    }

    // like
    const like: Like = {
      likeId: Date.now(),
      createdAt: new Date().toISOString(),
      ...post,
    };

    likes.push(like);
    await this.writeLikes(likes);

    return { liked: true, like };
  }
}