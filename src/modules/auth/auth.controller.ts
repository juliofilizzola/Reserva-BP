import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TypeRole } from '@prisma/client';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { IsPublic } from '../../decorators/is-public.decorator';
import { AuthRequest } from '../../model/AuthRequest.model';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Roles } from '../../decorators/roles.decorator';
import { TypeRoles } from '../../roles/role';
import { UserAuth } from '../../model/userAuth';
import { UpdatePasswordDto } from './dto/update-passwword.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '../user/entities/user.entity';
import { LoginRequest } from '../../model/LoginResquest.model';
import { ApiResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { UserToken } from '../../model/UserToken.model';
import { UserAlreadyExist } from '../../swagger/user-already-exist';
import { EmailOurPasswordIncorrect } from '../../swagger/email-our-password-incorrect';
import { MissingToken } from '../../swagger/missing-token';
import { UserNotPermission } from '../../swagger/user-not-permission';
import { RouteWithoutRole } from '../../swagger/route-without-role';
import { UserNotFound } from '../../swagger/user-not-found';
import { ResponseUpdatePassword } from '../../swagger/response-update-password';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create')
  @ApiOperation({
    description:
      'rota de criação de usuario (client), a rota valida se o mesmo já existe (o email deve ser unico no sistema)',
    summary: 'Auth Create user',
  })
  @ApiBadRequestResponse({
    description:
      'Validação de usuario já existente na base de dados, utilizamos o email para validação',
    type: UserAlreadyExist,
  })
  @ApiCreatedResponse({
    description: 'Foi Criado com sucesso',
    type: User,
  })
  @IsPublic()
  @ApiBody({ type: CreateAuthDto })
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto, TypeRole.client);
  }
  @IsPublic()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: LoginRequest,
  })
  @ApiUnauthorizedResponse({
    description: 'Email ou senha incorretos',
    type: EmailOurPasswordIncorrect,
  })
  @ApiResponse({
    status: 200,
    description: 'usuario logado com sucesso',
    type: UserToken,
  })
  @ApiOperation({
    description: 'rota de login do usuario',
    summary: 'Login',
  })
  login(@Request() req: AuthRequest) {
    return this.authService.login(req.user);
  }

  @Post('create-brokers')
  @ApiResponse({
    status: 401,
    type: MissingToken,
    description: 'quando o user não envia o token de validação',
  })
  @ApiBearerAuth('token')
  @Roles([TypeRoles.admin])
  @ApiOperation({
    description:
      'rota de criação de corretor, essa rota só pode ser acessada por um admin do sistema',
    summary: 'Create brokers',
  })
  @ApiBadRequestResponse({
    description:
      'Validação de usuario já existente na base de dados, utilizamos o email para validação',
    type: UserAlreadyExist,
  })
  @ApiBearerAuth('Authorization')
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Caso tenha algum erro de validação na regras da rota',
    type: RouteWithoutRole,
  })
  @ApiUnauthorizedResponse({
    description: 'Quando o user não tem permisão para acessar a essa rota',
    type: UserNotPermission,
  })
  createBrokers(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto, TypeRole.brokers);
  }

  @Patch('/update-password')
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    description: 'Rota de atualização da senha',
    summary: 'Update Password',
  })
  @ApiNotFoundResponse({
    description: 'Quando o user não foi encotrado na base de dados',
    type: UserNotFound,
  })
  @ApiResponse({
    status: 200,
    description: 'senha atualizada com sucesso',
    type: ResponseUpdatePassword,
  })
  @HttpCode(HttpStatus.OK)
  updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Req() request: UserAuth,
  ) {
    return this.authService.updatedPassword(
      request.user.sub,
      updatePasswordDto,
    );
  }
}
