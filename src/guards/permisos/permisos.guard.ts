import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';
import { Permisos } from 'src/common/enums/permisos.enum';
import { PERMISOS_KEY } from 'src/config/permisos.decorator';

@Injectable()
export class PermisosGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permisos[]>(
      PERMISOS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const { user }: { user: JwtPayloadDto } = context.switchToHttp().getRequest();

    const userPermissions = user.permisos || [];

    const hasAllPermissions = requiredPermissions.every(permisoRequerido =>
      userPermissions.includes(permisoRequerido)
    );

    if (!hasAllPermissions) {
      const missingPermissions = requiredPermissions.filter(permiso =>
        !userPermissions.includes(permiso)
      );
      throw new ForbiddenException(
        `No tiene los permisos necesarios para acceder a este recurso.`
      );
    }

    return hasAllPermissions;
  }
}
