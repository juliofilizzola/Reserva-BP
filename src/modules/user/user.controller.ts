import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserAuth } from '../../model/userAuth';
import { Roles } from '../../decorators/roles.decorator';
import { TypeRoles } from '../../roles/role';
import { PaginationParams } from '../../utils/paginations/type';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  findMe(@Req() request: UserAuth) {
    return this.userService.findOne(request.user.sub);
  }

  @Get('all')
  @Roles([TypeRoles.admin, TypeRoles.brokers])
  findAll(@Query() { page, limit }: PaginationParams) {
    const pagination: PaginationParams =
      page && limit ? { page: Number(page), limit: Number(limit) } : undefined;
    return this.userService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('/:id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param() id: string, @Body() updateUser: UpdateUserDto) {
    return this.userService.update(id, updateUser);
  }

  @Delete()
  delete(@Req() request: UserAuth) {
    return this.userService.delete(request.user.sub);
  }

  @Delete('admin/:id')
  @Roles([TypeRoles.admin])
  deleteAdmin(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
