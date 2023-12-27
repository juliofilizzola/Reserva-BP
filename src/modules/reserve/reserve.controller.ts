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

@Controller('reserve')
export class ReserveController {
  constructor(private readonly reserveService: ReserveService) {}

  @Post()
  @Roles([TypeRoles.client, TypeRoles.admin])
  create(@Body() createReserveDto: CreateReserveDto, @Req() req: UserAuth) {
    return this.reserveService.create(createReserveDto, req.user.sub);
  }

  @Get()
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
  update(@Param('id') id: string, @Body() updateReserveDto: UpdateReserveDto) {
    return this.reserveService.update(id, updateReserveDto);
  }

  @Delete(':id')
  @Roles([TypeRoles.admin, TypeRoles.client])
  remove(@Param('id') id: string) {
    return this.reserveService.remove(id);
  }
}
