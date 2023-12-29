import { Test, TestingModule } from '@nestjs/testing';
import { ReserveService } from './reserve.service';
import { PrismaService } from '../../prisma/prisma.service';
import { prismaMock } from '../../mocks/AuthAndUser.mock';

describe('ReserveService', () => {
  let service: ReserveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReserveService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ReserveService>(ReserveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
