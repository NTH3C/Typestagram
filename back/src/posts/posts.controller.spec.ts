import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('PostsController', () => {
  let controller: PostsController;
  let postsService: PostsService;
  let jwtService: JwtService;

  const mockPostsService = {
    getFeed: jest.fn(),
    getPostById: jest.fn(),
    createPost: jest.fn(),
    deletePost: jest.fn(),
    createComment: jest.fn(),
  };

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        { provide: PostsService, useValue: mockPostsService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    postsService = module.get<PostsService>(PostsService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // =========================
  // GET /posts
  // =========================
  describe('getFeed', () => {
    it('should return posts', () => {
      const result = [{ id: 1, content: 'hello' }];
      mockPostsService.getFeed.mockReturnValue(result);

      expect(controller.getFeed()).toBe(result);
      expect(postsService.getFeed).toHaveBeenCalled();
    });
  });

  // =========================
  // GET /posts/:id
  // =========================
  describe('getPost', () => {
    it('should return a post', () => {
      const post = { id: 1, content: 'test' };
      mockPostsService.getPostById.mockReturnValue(post);

      expect(controller.getPost('1')).toBe(post);
      expect(postsService.getPostById).toHaveBeenCalledWith(1);
    });

    it('should throw if post not found', () => {
      mockPostsService.getPostById.mockReturnValue(undefined);

      expect(() => controller.getPost('1')).toThrow(BadRequestException);
    });
  });

  // =========================
  // POST /posts
  // =========================
  describe('create', () => {
    it('should create a post', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({
        email: 'test@mail.com',
        id: '123',
      });

      mockPostsService.createPost.mockReturnValue({ id: 1 });

      const req = {
        headers: {
          authorization: 'Bearer token',
        },
      };

      const result = await controller.create({ content: 'hello' }, req);

      expect(result).toEqual({ id: 1 });
      expect(postsService.createPost).toHaveBeenCalledWith({
        content: 'hello',
        authorEmail: 'test@mail.com',
        uid: '123',
      });
    });

    it('should throw if content empty', async () => {
      await expect(
        controller.create({ content: '' }, { headers: {} }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if token missing', async () => {
      await expect(
        controller.create({ content: 'hello' }, { headers: {} }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if token invalid', async () => {
      mockJwtService.verifyAsync.mockRejectedValue(new Error());

      await expect(
        controller.create(
          { content: 'hello' },
          { headers: { authorization: 'Bearer token' } },
        ),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // =========================
  // DELETE /posts/:id
  // =========================
  describe('delete', () => {
    it('should call deletePost', async () => {
      await controller.delete('1');

      expect(postsService.deletePost).toHaveBeenCalledWith({ id: 1 });
    });
  });

  // =========================
  // POST /posts/:id/comments
  // =========================
  describe('createComment', () => {
    it('should create a comment', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({
        email: 'test@mail.com',
      });

      mockPostsService.createComment.mockReturnValue({ id: 1 });

      const req = {
        headers: {
          authorization: 'Bearer token',
        },
      };

      const result = await controller.createComment(
        '1',
        { text: 'nice' },
        req,
      );

      expect(result).toEqual({ id: 1 });
      expect(postsService.createComment).toHaveBeenCalledWith(1, {
        text: 'nice',
        authorEmail: 'test@mail.com',
      });
    });

    it('should throw if text empty', async () => {
      await expect(
        controller.createComment(
          '1',
          { text: '' },
          { headers: { authorization: 'Bearer token' } },
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if token missing', async () => {
      await expect(
        controller.createComment('1', { text: 'hello' }, { headers: {} }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
