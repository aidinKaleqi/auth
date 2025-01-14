import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Auth } from '../entity/auth.entity';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import * as process from 'node:process';
import { UnauthorizedException } from '@nestjs/common';
import { hashPassword, comparePassword } from '../utils/password.utils';

const mockUserRepository = {
  findOne: jest.fn(),
  insert: jest.fn(),
};

const mockAuthRepository = {
  insert: jest.fn(),
  findOne: jest.fn(),
};

jest.mock('../utils/password.utils');

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  let authRepository: Repository<Auth>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Auth),
          useValue: mockAuthRepository,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    authRepository = module.get<Repository<Auth>>(getRepositoryToken(Auth));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Accessibility: check service is registered', () => {
    expect(authService).toBeDefined();
  });

  describe('Method: checkUsername', () => {
    it('Success Case Scenario: should return True if user exists', async () => {
      mockUserRepository.findOne.mockResolvedValue({ username: 'testuser' });
      const result = await authService.checkUsername('testuser');
      expect(result).toBe(true);
    });
    it('Fail Case Scenario: should return False if user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      const result = await authService.checkUsername('nonexistentuser');
      expect(result).toBe(false);
    });
  });

  describe('Method: insertUser', () => {
    it('Success Case Scenario: should insert a new user successfully', async () => {
      const body = {
        username: 'testuser',
        password: 'testpassword',
        fullName: 'Test User',
      };
      const hashedPassword = 'hashedPassword';
      (hashPassword as jest.Mock).mockResolvedValue(hashedPassword);
      mockUserRepository.insert.mockResolvedValue({ raw: [], affected: 1 });

      const result = await authService.insertUser(body);
      expect(result).toBe(true);
      expect(mockUserRepository.insert).toHaveBeenCalledWith({
        username: body.username,
        password: hashedPassword,
        fullName: body.fullName,
      });
    });
    it('Fail Case Scenario: should throw an error if inserting user fails', async () => {
      const body = {
        username: 'testuser',
        password: 'testpassword',
        fullName: 'Test User',
      };
      (hashPassword as jest.Mock).mockResolvedValue('hashedPassword');
      mockUserRepository.insert.mockRejectedValue(new Error('Insert failed.'));
      await expect(authService.insertUser(body)).rejects.toThrow(
        'Insert failed',
      );
    });
  });

  describe('Method: login', () => {
    it('Success Case Scenario: should return a token if login is successful', async () => {
      const user = { username: 'testuser', id: 1, password: 'hashedPassword' };
      mockUserRepository.findOne.mockResolvedValue(user);
      (comparePassword as jest.Mock).mockResolvedValueOnce(true);

      const token = 'mockedToken';
      jest.spyOn(jwt, 'sign').mockReturnValue(token);

      const result = await authService.login('testuser', 'correctpassword');
      expect(result).toBe(token);
      expect(jwt.sign).toHaveBeenCalledWith(
        { username: user.username, userId: user.id },
        process.env.TOKEN_SECRET,
      );
    });
    it('Fail Case Scenario: should throw UnauthorizedException if password is incorrect', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        username: 'testuser',
        password: 'hashedPassword',
      });
      (comparePassword as jest.Mock).mockResolvedValueOnce(false);

      await expect(
        authService.login('testuser', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('Method: verifyToken', () => {
    it('Success Case Scenario: should return valid token verification result', async () => {
      const decodedToken = { userId: 1, username: 'testuser' };
      const token = 'ValidToken';

      jest.spyOn(authService, 'decodeToken').mockReturnValue({
        status: true,
        decoded: decodedToken,
      });
      mockAuthRepository.findOne.mockResolvedValue({ token });

      const result = await authService.verifyToken(token);
      expect(result).toEqual({
        id: decodedToken.userId,
        username: decodedToken.username,
        status: true,
        message: 'user logged in successfully',
      });
    });
    it('Fail Case Scenario: should throw Error if token is invalid', async () => {
      const decodedToken = { status: false, decoded: null };
      const token = 'InvalidToken';

      jest.spyOn(authService, 'decodeToken').mockReturnValue(decodedToken);

      const result = await authService.verifyToken(token);
      expect(result).toEqual({
        id: null,
        username: null,
        status: false,
        message: 'login failed!',
      });
    });
  });
});
