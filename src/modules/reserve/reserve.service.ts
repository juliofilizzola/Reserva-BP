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

    const validation = await this.validateReservation({
      date: createReserveDto.date,
      duration: createReserveDto.duration,
      idBroker: createReserveDto.idBroker,
    });

    if (!validation.valid) {
      throw new BadRequestException({
        message: validation.message,
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
      date: updateReserveDto?.date || reserve.date,
      duration: updateReserveDto?.duration || reserve.duration,
      description: updateReserveDto?.description || reserve.description,
      title: updateReserveDto?.title || reserve.title,
    };

    if (updateReserveDto?.idBroker) {
      const validation = await this.validateReservation({
        date: updateReserveDto?.date || reserve.date,
        duration: updateReserveDto?.duration || reserve.duration,
        idBroker: updateReserveDto?.idBroker || reserve.brokerId,
      });

      if (validation.valid) {
        throw new BadRequestException({
          message: validation.message,
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

    await this.prismaService.reserve.update({
      where: {
        id,
      },
      data: reserveUpdateInput,
    });

    return {
      response: 'reserve updated success',
    };
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

  private async validateReservation(
    data: IValidationReserve,
  ): Promise<IResponseValidationReserve> {
    const currentDate = new Date();

    if (data.date < currentDate) {
      return {
        valid: false,
        message: 'The selected date has already passed.',
      };
    }

    const broker = await this.prismaService.user.findFirst({
      where: {
        id: data.idBroker,
        type: TypeRole.brokers,
      },
    });

    if (!broker) {
      return {
        valid: false,
        message: 'Broker not found.',
      };
    }

    if (data.duration > 120 || data.duration < 30) {
      return {
        valid: false,
        message:
          'Invalid duration: Duration must be between 30 and 120 minutes.',
      };
    }

    const endReservationTime = addMinutes(data.date, data.duration);

    const overlappingReservations = await this.prismaService.reserve.findMany({
      where: {
        broker: {
          id: broker.id,
        },
        date: {
          gte: currentDate,
        },
      },
    });

    const isDurationAvailable = overlappingReservations.some((reservation) => {
      const reservationDurationOverlapping = addMinutes(
        reservation.date,
        reservation.duration,
      );
      return (
        (endReservationTime > reservation.date &&
          endReservationTime < reservationDurationOverlapping) ||
        reservation.date === data.date
      );
    });

    return {
      valid: !isDurationAvailable,
      message: isDurationAvailable
        ? 'Reservation with this duration is not available.'
        : null,
    };
  }
}
