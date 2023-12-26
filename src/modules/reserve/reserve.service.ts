import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReserveDto } from './dto/create-reserve.dto';
import { UpdateReserveDto } from './dto/update-reserve.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { addMinutes } from 'date-fns';
import { Prisma, Reserve, TypeRole } from '@prisma/client';
import { paginateResponse } from '../../utils/paginations/pagination';
import { PaginationParams } from '../../utils/paginations/type';

interface IValidationBroker {
  idBroker: string;
  duration: number;
  appointment: Date;
  date: Date;
}
@Injectable()
export class ReserveService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createReserveDto: CreateReserveDto, userId: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
      });
    }

    const validation = this.validationBroker({
      appointment: createReserveDto.appointment,
      date: createReserveDto.date,
      duration: createReserveDto.duration,
      idBroker: createReserveDto.idBroker,
    });

    if (!validation) {
      throw new BadRequestException({
        message: 'Reservation with this duration is not available',
      });
    }

    return this.prismaService.reserve.create({
      data: {
        broker: {
          connect: {
            id: createReserveDto.idBroker,
          },
        },
        client: {
          connect: {
            id: user.id,
          },
        },
        appointment: createReserveDto.appointment,
        date: createReserveDto.date,
        duration: createReserveDto.duration,
        description: createReserveDto.description,
        title: createReserveDto.title,
      },
    });
  }

  async findAll(pagination?: PaginationParams) {
    if (pagination) {
      const { page, limit } = pagination;
      const response = await this.prismaService.$transaction([
        this.prismaService.reserve.count({}),
        this.prismaService.reserve.findMany({
          where: {},
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),
      ]);

      return paginateResponse<Reserve>({
        page,
        limit,
        total: response[0],
        result: response[1],
      });
    }

    return this.prismaService.reserve.findMany({});
  }

  async findOne(id: string) {
    const reserve = await this.prismaService.reserve.findFirst({
      where: {
        id,
      },
    });

    if (!reserve) {
      throw new NotFoundException({
        message: 'reserve not found',
      });
    }

    return reserve;
  }

  async update(id: string, updateReserveDto: UpdateReserveDto) {
    const reserve = await this.prismaService.reserve.findFirst({
      where: {
        id,
      },
    });

    if (!reserve) {
      throw new NotFoundException({
        message: 'reserve not found',
      });
    }

    let reserveUpdateInput: Prisma.ReserveUpdateInput = {
      appointment: updateReserveDto?.appointment || reserve.appointment,
      date: updateReserveDto?.date || reserve.date,
      duration: updateReserveDto?.duration || reserve.duration,
      description: updateReserveDto?.description || reserve.description,
      title: updateReserveDto?.title || reserve.title,
    };

    if (updateReserveDto?.idBroker) {
      const validation = this.validationBroker({
        appointment: updateReserveDto?.appointment || reserve.appointment,
        date: updateReserveDto?.date || reserve.date,
        duration: updateReserveDto?.duration || reserve.duration,
        idBroker: updateReserveDto?.idBroker || reserve.brokerId,
      });

      if (!validation) {
        throw new BadRequestException({
          message: 'Reservation with this duration is not available',
        });
      }

      reserveUpdateInput = {
        ...reserveUpdateInput,
        broker: {
          connect: {
            id: updateReserveDto.idBroker,
          },
        },
      };
    }

    return this.prismaService.reserve.update({
      where: {
        id,
      },
      data: reserveUpdateInput,
    });
  }

  async remove(id: string) {
    const reserve = await this.prismaService.reserve.findFirst({
      where: {
        id,
      },
    });

    if (!reserve) {
      throw new NotFoundException({
        message: 'reserve not found',
      });
    }

    return this.prismaService.reserve.delete({
      where: {
        id,
      },
    });
  }

  private async validationBroker(data: IValidationBroker): Promise<boolean> {
    const broker = await this.prismaService.user.findFirst({
      where: {
        id: data.idBroker,
      },
    });

    if (!broker || broker.type !== TypeRole.brokers) {
      throw new NotFoundException({
        message: 'Broker not found',
      });
    }

    if (data.duration > 120 || data.duration < 30) {
      throw new BadRequestException({
        message:
          'Invalid duration: Max duration 120 minutes, Min duration 30 minutes',
      });
    }

    const durationReserve = addMinutes(data.appointment, data.duration);

    const overlappingReservations = await this.prismaService.reserve.findMany({
      where: {
        broker: {
          id: broker.id,
        },
        AND: {
          date: data.date,
          appointment: {
            gte: data.appointment,
            lte: durationReserve,
          },
        },
      },
    });

    const validDuration = overlappingReservations.filter(
      (value) => durationReserve > value.appointment,
    );
    return !!validDuration.length;
  }
}
