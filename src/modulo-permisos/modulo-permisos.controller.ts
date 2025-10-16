import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ModuloPermisosService } from './modulo-permisos.service';
import { CreateModuloPermisoDto } from './dto/create-modulo-permiso.dto';
import { UpdateModuloPermisoDto } from './dto/update-modulo-permiso.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('modulo-permisos')
@UseGuards(AuthGuard('jwt'))
export class ModuloPermisosController {
  constructor(private readonly moduloPermisosService: ModuloPermisosService) {}

  @Post()
  create(@Body() createModuloPermisoDto: CreateModuloPermisoDto) {
    return this.moduloPermisosService.create(createModuloPermisoDto);
  }

  @Get()
  findAll() {
    return this.moduloPermisosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moduloPermisosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateModuloPermisoDto: UpdateModuloPermisoDto) {
    return this.moduloPermisosService.update(+id, updateModuloPermisoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moduloPermisosService.remove(+id);
  }
}
