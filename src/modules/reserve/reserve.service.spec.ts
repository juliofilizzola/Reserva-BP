import { Test, TestingModule } from '@nestjs/testing';
import { ReserveService } from './reserve.service';
import { PrismaService } from '../../prisma/prisma.service';
import { fakeUser2, prismaMock } from '../../mocks/mock';
import { addDays } from 'date-fns';

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

  it('should validate reservation', async () => {
    const valid = await service.validateReservation({
      date: addDays(new Date(), 3),
      duration: 30,
      idBroker: fakeUser2[1].id,
    });

    expect(valid.valid).toBe(true);
    expect(valid.message).toBe(null);
  });
});
