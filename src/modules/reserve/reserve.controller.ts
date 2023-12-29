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
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserNotPermission } from '../../swagger/user-not-permission';
import { RouteWithoutRole } from '../../swagger/route-without-role';

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
  @Roles([TypeRoles.client, TypeRoles.admin])
  create(@Body() createReserveDto: CreateReserveDto, @Req() req: UserAuth) {
    return this.reserveService.create(createReserveDto, req.user.sub);
  }

  @Get()
  @ApiQuery({ type: PaginationParams })
  findAll(@Query() { page, limit }: PaginationParams) {
    const pagination: PaginationParams =
      page && limit ? { page: Number(page), limit: Number(limit) } : undefined;
    return this.reserveService.findAll(pagination);
  }

  @Get(':id')
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
  update(@Param('id') id: string, @Body() updateReserveDto: UpdateReserveDto) {
    return this.reserveService.update(id, updateReserveDto);
  }

  @Delete(':id')
  @Roles([TypeRoles.admin, TypeRoles.client])
  @ApiBadRequestResponse({
    description: 'Caso tenha algum erro de validação na regras da rota',
    type: RouteWithoutRole,
  })
  @ApiUnauthorizedResponse({
    description: 'Quando o user não tem permisão para acessar a essa rota',
    type: UserNotPermission,
  })
  remove(@Param('id') id: string) {
    return this.reserveService.remove(id);
  }
}
