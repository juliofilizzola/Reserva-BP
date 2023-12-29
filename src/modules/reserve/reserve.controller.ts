import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ReserveService } from './reserve.service';
import { CreateReserveDto } from './dto/create-reserve.dto';
import { UpdateReserveDto } from './dto/update-reserve.dto';
import { UserAuth } from '../../model/userAuth';
import { Roles } from '../../decorators/roles.decorator';
import { TypeRoles } from '../../roles/role';
import { PaginationParams } from '../../utils/paginations/type';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserNotPermission } from '../../swagger/user-not-permission';
import { RouteWithoutRole } from '../../swagger/route-without-role';
import { ApiResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { Reserve } from './entities/reserve.entity';
import { ResponsePaginationReserve } from '../../swagger/response-pagination-reserve';
import { ReserveNotFound } from '../../swagger/reserve-not-found';
import { ResponseUpdateReserve } from '../../swagger/response-update-reserve';
import { ResponseRemoveReserve } from '../../swagger/response-remove-reserve';

@ApiTags('Reserve')
@ApiBearerAuth('Authorization')
@Controller('reserve')
export class ReserveController {
  constructor(private readonly reserveService: ReserveService) {}

  @Post()
  @ApiBadRequestResponse({
    description: 'Caso tenha algum erro de validação na regras da rota',
    type: RouteWithoutRole,
  })
  @ApiUnauthorizedResponse({
    description: 'Quando o user não tem permisão para acessar a essa rota',
    type: UserNotPermission,
  })
  @ApiOperation({
    description:
      'rota de criação de reserva (só o cliente e admin podem reservar)',
    summary: 'Create',
  })
  @Roles([TypeRoles.client, TypeRoles.admin])
  create(@Body() createReserveDto: CreateReserveDto, @Req() req: UserAuth) {
    return this.reserveService.create(createReserveDto, req.user.sub);
  }

  @Get()
  @ApiResponse({
    status: 202,
    type: ResponsePaginationReserve,
    description: 'Retorno de reserva paginada',
  })
  @ApiOkResponse({
    type: [Reserve],
    description: 'Retorno de reserva',
  })
  @ApiOperation({
    description: 'Retorno das reservas',
    summary: 'Retorno das reservas',
  })
  @ApiQuery({ type: PaginationParams })
  findAll(@Query() { page, limit }: PaginationParams) {
    const pagination: PaginationParams =
      page && limit ? { page: Number(page), limit: Number(limit) } : undefined;
    return this.reserveService.findAll(pagination);
  }

  @Get(':id')
  @ApiResponse({
    status: 202,
    type: Reserve,
    description: 'Retorno de reserva',
  })
  @ApiOperation({
    summary: 'Find One',
    description: 'Busca por reserva pelo Id',
  })
  @ApiNotFoundResponse({
    type: ReserveNotFound,
    description: 'Quando não é encontrado a reserva',
  })
  findOne(@Param('id') id: string) {
    return this.reserveService.findOne(id);
  }

  @Patch(':id')
  @Roles([TypeRoles.admin, TypeRoles.client])
  @ApiBadRequestResponse({
    description: 'Caso tenha algum erro de validação na regras da rota',
    type: RouteWithoutRole,
  })
  @ApiUnauthorizedResponse({
    description: 'Quando o user não tem permisão para acessar a essa rota',
    type: UserNotPermission,
  })
  @ApiOperation({
    summary: 'Update',
    description: 'Rota de atualização da reserva',
  })
  @ApiNotFoundResponse({
    type: ReserveNotFound,
    description: 'Quando não é encontrado a reserva',
  })
  @ApiOkResponse({
    description: 'Quando a reserva é deletada com sucesso',
    type: ResponseUpdateReserve,
  })
  update(@Param('id') id: string, @Body() updateReserveDto: UpdateReserveDto) {
    return this.reserveService.update(id, updateReserveDto);
  }

  @Delete(':id')
  @Roles([TypeRoles.admin, TypeRoles.client])
  @ApiNotFoundResponse({
    type: ReserveNotFound,
    description: 'Quando não é encontrado a reserva',
  })
  @ApiBadRequestResponse({
    description: 'Caso tenha algum erro de validação na regras da rota',
    type: RouteWithoutRole,
  })
  @ApiOperation({
    summary: 'Delete',
    description: 'Rota de deletar da reserva',
  })
  @ApiUnauthorizedResponse({
    description: 'Quando o user não tem permisão para acessar a essa rota',
    type: UserNotPermission,
  })
  @ApiOkResponse({
    description: 'Quando a reserva é deletada com sucesso',
    type: ResponseRemoveReserve,
  })
  remove(@Param('id') id: string) {
    return this.reserveService.remove(id);
  }
}
