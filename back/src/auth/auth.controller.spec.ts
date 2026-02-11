import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';


describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // =========================
  // REGISTER
  // =========================
  describe('register', () => {
    it('should call authService.register', async () => {
      mockAuthService.register.mockResolvedValue({ id: 1 });

      const body = {
        username: 'nathan',
        email: 'test@mail.com',
        password: '1234',
      };

      const result = await controller.register(body);

      expect(result).toEqual({ id: 1 });
      expect(authService.register).toHaveBeenCalledWith(
        'nathan',
        'test@mail.com',
        '1234',
      );
    });
  });

  // =========================
  // LOGIN
  // =========================
  describe('login', () => {
    it('should return login result', async () => {
      mockAuthService.login.mockResolvedValue({
        access_token: 'jwt',
      });

      const result = await controller.login({
        email: 'test@mail.com',
        password: '1234',
      });

      expect(result).toEqual({ access_token: 'jwt' });
      expect(authService.login).toHaveBeenCalledWith(
        'test@mail.com',
        '1234',
      );
    });

    it('should return error message if login fails', async () => {
      mockAuthService.login.mockResolvedValue(null);

      const result = await controller.login({
        email: 'wrong@mail.com',
        password: 'bad',
      });

      expect(result).toEqual({
        message: 'Email ou mot de passe invalide',
      });
    });
  });
});
