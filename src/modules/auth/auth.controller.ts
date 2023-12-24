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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create')
  @IsPublic()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto, TypeRole.client);
  }
  @IsPublic()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Request() req: AuthRequest) {
    return this.authService.login(req.user);
  }

  @Post('create-brokers')
  @Roles([TypeRoles.admin])
  createBrokers(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto, TypeRole.brokers);
  }

  @Patch('/update-password')
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
