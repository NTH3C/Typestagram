import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

export type CommentModel = {
  id: number;
  text: string;
  authorEmail: string;
  createdAt: string;
};

export type PostModel = {
  id: number;
  content: string;
  authorEmail: string;
  createdAt: string;
  uid: string;
  comments: CommentModel[];
  imageUrl?: string;
};

@Injectable()
export class PostsService {
  private filePath = path.join(process.cwd(), 'data', 'posts.json');

  // Lire le fichier
  private async readPosts(): Promise<PostModel[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  // Écrire dans le fichier
  private async writePosts(posts: PostModel[]) {
    await fs.writeFile(this.filePath, JSON.stringify(posts, null, 2));
  }

  async getFeed(): Promise<PostModel[]> {
    return this.readPosts();
  }

  async createPost(input: {
    content: string;
    authorEmail: string;
    uid: string;
    imageUrl?: string;
  }): Promise<PostModel> {
    const posts = await this.readPosts();

    const post: PostModel = {
      id: Date.now(),
      content: input.content,
      authorEmail: input.authorEmail,
      createdAt: new Date().toISOString(),
      uid: input.uid,
      comments: [],
      imageUrl: input.imageUrl,
    };

    posts.push(post);
    await this.writePosts(posts);

    return post;
  }

  async deletePost(input: { id: number }) {
    const posts = await this.readPosts();

    const updated = posts.filter(post => post.id !== input.id);

    if (updated.length === posts.length) {
      return {message: "Post don't exist"};
    }

    await this.writePosts(updated);

    return { message: 'Post deleted' };
  }

  async getPostById(id: number): Promise<PostModel | undefined> {
    const posts = await this.readPosts();
    return posts.find(p => p.id === id);
  }

  async createComment(
    postId: number,
    input: { text: string; authorEmail: string }
  ): Promise<CommentModel> {
    const posts = await this.readPosts();

    const post = posts.find(p => p.id === postId);
    if (!post) return {id:0, text:"", authorEmail:'', createdAt:"test"};

    const comment: CommentModel = {
      id: Date.now(),
      text: input.text,
      authorEmail: input.authorEmail,
      createdAt: new Date().toISOString(),
    };

    post.comments.push(comment);

    await this.writePosts(posts);

    return comment;
  }
}