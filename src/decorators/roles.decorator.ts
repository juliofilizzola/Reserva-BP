import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { RoleInterceptor } from '../interceptor/role.interceptor';
import { TypeRoles } from '../roles/role';

const SetRole = (role: TypeRoles[]) => SetMetadata('roles', role);
export const Roles = (roles: TypeRoles[]) => {
  return applyDecorators(SetRole(roles), UseInterceptors(RoleInterceptor));
};
