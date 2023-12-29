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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { MissingToken } from '../../swagger/missing-token';
import { UserNotPermission } from '../../swagger/user-not-permission';
import { User } from './entities/user.entity';
import { RouteWithoutRole } from '../../swagger/route-without-role';
import { UpdateUser } from '../../swagger/update-user';
import { DeleteUser } from '../../swagger/delete-user';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth('Authorization')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiResponse({
    status: 401,
    type: MissingToken,
    description: 'quando o user não envia o token de validação',
  })
  @ApiResponse({
    status: 202,
    description: 'User Encontrato com sucesso',
    type: User,
  })
  @ApiOperation({
    description: 'Rota de puxar os dados do usuario logado',
    summary: 'Me',
  })
  findMe(@Req() request: UserAuth) {
    return this.userService.findOne(request.user.sub);
  }

  @Get('all')
  @Roles([TypeRoles.admin, TypeRoles.brokers])
  @ApiResponse({
    status: 401,
    type: MissingToken,
    description: 'quando o user não envia o token de validação',
  })
  @ApiOperation({
    description: 'Rota de puxar os dados de todos os usuario',
    summary: 'All',
  })
  @ApiResponse({
    status: 202,
    description: 'Usuarios encontratos com sucesso',
    type: [User],
  })
  @ApiUnauthorizedResponse({
    description: 'Quando o user não tem permisão para acessar a essa rota',
    type: UserNotPermission,
  })
  @ApiQuery({ type: PaginationParams })
  findAll(@Query() { page, limit }: PaginationParams) {
    const pagination: PaginationParams =
      page && limit ? { page: Number(page), limit: Number(limit) } : undefined;
    return this.userService.findAll(pagination);
  }

  @Get(':id')
  @Roles([TypeRoles.admin, TypeRoles.brokers])
  @ApiUnauthorizedResponse({
    description: 'Quando o user não tem permisão para acessar a essa rota',
    type: UserNotPermission,
  })
  @ApiResponse({
    status: 202,
    description: 'User Encontrato com sucesso',
    type: User,
  })
  @ApiOperation({
    description: 'Rota de puxar os dados de um usuario',
    summary: ':Id',
  })
  @ApiResponse({
    status: 401,
    type: MissingToken,
    description: 'quando o user não envia o token de validação',
  })
  @ApiBadRequestResponse({
    description: 'Caso tenha algum erro de validação na regras da rota',
    type: RouteWithoutRole,
  })
  findOne(@Param(':id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch('admin/:id')
  @ApiResponse({
    status: 401,
    type: MissingToken,
    description: 'quando o user não envia o token de validação',
  })
  @ApiBadRequestResponse({
    description: 'Caso tenha algum erro de validação na regras da rota',
    type: RouteWithoutRole,
  })
  @ApiOperation({
    summary: 'Admin',
    description: 'rota ao qual o admim pode atualizar o usuario',
  })
  @ApiUnauthorizedResponse({
    description: 'Quando o user não tem permisão para acessar a essa rota',
    type: UserNotPermission,
  })
  @ApiResponse({
    status: 202,
    description: 'Usuario atualizado com sucesso',
    type: UpdateUser,
  })
  @Roles([TypeRoles.admin])
  updateAdmin(@Param() id: string, @Body() updateUser: UpdateUserDto) {
    return this.userService.update(id, updateUser);
  }
  @Patch()
  @ApiOperation({
    summary: 'Update',
    description: 'rota ao qual o usuario pode atualizar seus dados',
  })
  @ApiResponse({
    status: 401,
    type: MissingToken,
    description: 'quando o user não envia o token de validação',
  })
  @ApiBody({
    type: UpdateUserDto,
  })
  @ApiResponse({
    status: 202,
    description: 'Usuario atualizado com sucesso',
    type: UpdateUser,
  })
  update(@Req() req: UserAuth, @Body() updateUser: UpdateUserDto) {
    return this.userService.update(req.user.sub, updateUser);
  }

  @Delete()
  @ApiOperation({
    summary: 'Delete',
    description: 'rota ao qual o usuario pode deletar seus dados',
  })
  @ApiResponse({
    status: 401,
    type: MissingToken,
    description: 'quando o user não envia o token de validação',
  })
  @ApiOkResponse({
    description: 'user deletado com sucesso',
    type: DeleteUser,
  })
  delete(@Req() request: UserAuth) {
    return this.userService.delete(request.user.sub);
  }

  @Delete('admin/:id')
  @Roles([TypeRoles.admin])
  @ApiResponse({
    status: 401,
    type: MissingToken,
    description: 'quando o user não envia o token de validação',
  })
  @ApiOperation({
    summary: 'Admin',
    description: 'rota ao qual o admim pode deletar um usuario',
  })
  @ApiBadRequestResponse({
    description: 'Caso tenha algum erro de validação na regras da rota',
    type: RouteWithoutRole,
  })
  @ApiUnauthorizedResponse({
    description: 'Quando o user não tem permisão para acessar a essa rota',
    type: UserNotPermission,
  })
  @ApiOkResponse({
    description: 'user deletado com sucesso',
    type: DeleteUser,
  })
  deleteAdmin(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
