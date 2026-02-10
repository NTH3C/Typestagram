import { Injectable } from '@nestjs/common';

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
};

@Injectable()
export class PostsService {
  private posts: PostModel[] = [];

  getFeed(): PostModel[] {
    return this.posts;
  }

  createPost(input: { content: string; authorEmail: string; uid: string }): PostModel {
    const post: PostModel = {
      id: Date.now(),
      content: input.content,
      authorEmail: input.authorEmail,
      createdAt: new Date().toISOString(),
      uid: input.uid,
      comments: [],
    };

    this.posts.push(post);

    return post;
  }

  getPostById(id: number): PostModel | undefined {
    return this.posts.find((p) => p.id === id);
  }

  createComment(postId: number, input: { text: string; authorEmail: string }): CommentModel {
    const post = this.getPostById(postId);
    if (!post) throw new Error('Post not found');

    const comment: CommentModel = {
      id: Date.now(),
      text: input.text,
      authorEmail: input.authorEmail,
      createdAt: new Date().toISOString(),
    };

    post.comments.push(comment);
    return comment;
  }
}