import { Test, TestingModule } from '@nestjs/testing';
import { ReserveService } from './reserve.service';
import { PrismaService } from '../../prisma/prisma.service';
import { fakeUser2, prismaMock, reserveError } from '../../mocks/mock';
import { addDays, subDays } from 'date-fns';

describe('ReserveService', () => {
  let service: ReserveService;
  let prismaService: PrismaService;

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

    prismaService = module.get<PrismaService>(PrismaService);
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
  it('should validate reservation error minutes', async () => {
    const valid = await service.validateReservation({
      date: addDays(new Date(), 3),
      duration: 20,
      idBroker: fakeUser2[1].id,
    });

    expect(valid.valid).toBe(false);
    expect(valid.message).toEqual(
      'Invalid duration: Duration must be between 30 and 120 minutes.',
    );
  });

  it('should validate reservation error date', async () => {
    const valid = await service.validateReservation({
      date: subDays(new Date(), 3),
      duration: 30,
      idBroker: fakeUser2[1].id,
    });

    expect(valid.valid).toBe(false);
    expect(valid.message).toEqual('The selected date has already passed.');
  });

  it('should validate reservation error broker', async () => {
    jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);
    const valid = await service.validateReservation({
      date: addDays(new Date(), 3),
      duration: 30,
      idBroker: fakeUser2[1].id,
    });

    expect(valid.valid).toBe(false);
    expect(valid.message).toEqual('Broker not found.');
  });
  it('should validate reservation error reservation', async () => {
    jest
      .spyOn(prismaService.reserve, 'findMany')
      .mockResolvedValue([reserveError]);
    const valid = await service.validateReservation({
      date: new Date('2024-01-01T19:00:00.000Z'),
      duration: 31,
      idBroker: fakeUser2[1].id,
    });

    expect(valid.valid).toBe(false);
    expect(valid.message).toEqual(
      'Reservation with this duration is not available.',
    );
  });
});
