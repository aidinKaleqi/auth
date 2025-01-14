import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { VerifyDto } from '../dto/verify.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            checkUsername: jest.fn(),
            insertUser: jest.fn(),
            login: jest.fn(),
            verifyToken: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('Accessibility: check controller is registered', () => {
    expect(authController).toBeDefined();
  });

  describe('Method: signUp', () => {
    it('Success Case Scenario: should create a user successfully', async () => {
      const body: SignupDto = {
        username: 'testuser',
        password: 'password',
        fullName: 'Test User',
      };
      jest.spyOn(authService, 'checkUsername').mockResolvedValueOnce(false);
      jest.spyOn(authService, 'insertUser').mockResolvedValueOnce(undefined);

      const result = await authController.signUp(body);
      expect(result).toEqual({
        status: 'success',
        message: 'User created successfully',
      });
    });

    it('Fail Case Scenario: should throw an error if user already exists', async () => {
      const body: SignupDto = {
        username: 'testuser',
        password: 'password',
        fullName: 'Test User',
      };
      jest.spyOn(authService, 'checkUsername').mockResolvedValueOnce(true);

      await expect(authController.signUp(body)).rejects.toEqual(
        'User Already Exists',
      );
    });
  });

  describe('Method: login', () => {
    it('Success Case Scenario: should return a token if login is successful', async () => {
      const body: LoginDto = { username: 'testuser', password: 'password' };
      jest.spyOn(authService, 'checkUsername').mockResolvedValueOnce(true);
      jest.spyOn(authService, 'login').mockResolvedValueOnce('testtoken');

      const result = await authController.login(body);
      expect(result).toEqual({ token: 'testtoken' });
    });

    it('Fail Case Scenario: should throw an error if username or password is incorrect', async () => {
      const body: LoginDto = { username: 'testuser', password: 'password' };
      jest.spyOn(authService, 'checkUsername').mockResolvedValueOnce(false);

      await expect(authController.login(body)).rejects.toEqual({
        status: 'error',
        message: 'Incorrect username or password',
      });
    });
  });

  describe('Method: verify', () => {
    it('Success Case Scenario: should verify a token successfully', async () => {
      const body: VerifyDto = { token: 'testtoken' };
      const expectedResponse = {
        id: 1,
        username: 'testuser',
        status: true,
        message: 'user logged in successfully',
      };
      jest
        .spyOn(authService, 'verifyToken')
        .mockResolvedValueOnce(expectedResponse);
      const result = await authController.verify(body);
      expect(result).toEqual(expectedResponse);
    });
    it('Fail Case Scenario: should return an error if token verification fails', async () => {
      const body: VerifyDto = { token: 'invalidtoken' };
      const expectedResponse = {
        id: null,
        username: null,
        status: false,
        message: 'login failed!',
      };
      jest
        .spyOn(authService, 'verifyToken')
        .mockResolvedValueOnce(expectedResponse);
      const result = await authController.verify(body);
      expect(result).toEqual(expectedResponse);
    });
  });
});
