import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermisosGuard } from 'src/guards/permisos/permisos.guard';
import { RequerirPermisos } from 'src/config/permisos.decorator';
import { Permisos } from 'src/common/enums/permisos.enum';

@Controller('usuarios')
@UseGuards(AuthGuard('jwt'), PermisosGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @RequerirPermisos(Permisos.CrearUsuarios)
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  @RequerirPermisos(Permisos.LeerUsuarios)
  findAll(@Query('searchTerm') searchTerm?: string) {
    return this.usuariosService.findAll(searchTerm);
  }

  @Get(':id')
  @RequerirPermisos(Permisos.LeerUsuario)
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(+id);
  }

  @Get(':id/detalles')
  @RequerirPermisos(Permisos.LeerUsuario)
  findOneDetails(@Param('id') id: string) {
    return this.usuariosService.findOneDetails(+id);
  }

  @Patch(':id')
  @RequerirPermisos(Permisos.EditarUsuarios)
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  @RequerirPermisos(Permisos.EliminarUsuarios)
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }
}
