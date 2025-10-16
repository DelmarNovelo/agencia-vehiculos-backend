import { SetMetadata } from '@nestjs/common';
import { Permisos } from 'src/common/enums/permisos.enum';

export const PERMISOS_KEY = 'permisos';

export const RequerirPermisos = (...permisos: Permisos[]) => SetMetadata(PERMISOS_KEY, permisos);