import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { TypeRole } from '@prisma/client';
import { CreateAuthDto } from './dto/create-auth.dto';
import { fakeUser, fakeUser2, prismaMock } from '../../mocks/AuthAndUser.mock';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        JwtService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(fakeUser2[2]);
      const result = await authService.create(fakeUser[0], TypeRole.client);
      expect(result).toEqual(fakeUser2[2]);
      expect(prismaService.user.create).toHaveBeenCalledWith(
        expect.any(Object),
      );
    });

    it('should throw BadRequestException for invalid document', async () => {
      const createAuthDto: CreateAuthDto = {
        email: 'john@example.com',
        document: 'invalid-document',
        phone: '1234567890',
        name: 'John Doe',
        password: 'password123',
      };

      await expect(
        authService.create(createAuthDto, TypeRole.client),
      ).rejects.toThrow(BadRequestException);
    });

    it('should type user', async () => {
      prismaService.user.create = jest.fn().mockReturnValue(fakeUser2[2]);
      const result = await authService.create(fakeUser[0], TypeRole.client);

      expect(result.type).toEqual(TypeRole.client);
    });
  });

  describe('login', () => {
    it('should be defined', () => {
      expect(authService.login).toBeDefined();
    });

    it('should return a JWT token', async () => {
      expect(typeof (await authService.login(fakeUser2[1]))).toEqual('object');
    });

    it('should return a JWT token', async () => {
      expect(
        typeof (await authService.login(fakeUser2[1])).access_token,
      ).toEqual('string');
    });
  });

  describe('create broker', () => {
    it('should create a user', async () => {
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(fakeUser2[1]);
      const result = await authService.create(fakeUser[0], TypeRole.brokers);
      expect(result).toEqual(fakeUser2[1]);
      expect(prismaService.user.create).toHaveBeenCalledWith(
        expect.any(Object),
      );
    });

    it('should throw BadRequestException for invalid document', async () => {
      const createAuthDto: CreateAuthDto = {
        email: 'john@example.com',
        document: 'invalid-document',
        phone: '1234567890',
        name: 'John Doe',
        password: 'password123',
      };

      await expect(
        authService.create(createAuthDto, TypeRole.client),
      ).rejects.toThrow(BadRequestException);
    });

    it('should type user', async () => {
      const result = await authService.create(fakeUser[0], TypeRole.brokers);
      expect(result.type).toEqual(TypeRole.brokers);
    });
  });

  describe('valid user', () => {
    it('should be defined', () => {
      expect(authService.validateUser).toBeDefined();
    });

    it('should return a user', async () => {
      (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(true);
      const result = await authService.validateUser(
        fakeUser2[1].email,
        '12345344',
      );

      expect(result).toEqual(fakeUser2[2]);
      expect(prismaService.user.findFirst).toHaveBeenCalledWith(
        expect.any(Object),
      );
      expect(result.type).toEqual(TypeRole.client);
      expect(result.email).toEqual(fakeUser2[2].email);
    });

    it('should return error', async () => {
      (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(false);
      try {
        await authService.validateUser(fakeUser2[1].email, '12345344');
      } catch (e) {
        expect(e).toEqual(
          new UnauthorizedException({
            message: 'Email address or password provided is incorrect.',
          }),
        );
      }
    });
  });
});
