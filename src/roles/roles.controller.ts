import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermisosGuard } from 'src/guards/permisos/permisos.guard';
import { RequerirPermisos } from 'src/config/permisos.decorator';
import { Permisos } from 'src/common/enums/permisos.enum';

@Controller('roles')
@UseGuards(AuthGuard('jwt'), PermisosGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @RequerirPermisos(Permisos.Roles)
  create(@Body() createRoleDto: CreateRolDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @RequerirPermisos(Permisos.Roles)
  findAll(@Query('searchTerm') searchTerm?: string) {
    return this.rolesService.findAll(searchTerm);
  }

  @Get('for-select')
  @RequerirPermisos(Permisos.Roles)
  findAllForSelect() {
    return this.rolesService.findAllForSelect();
  }

  @Get(':id')
  @RequerirPermisos(Permisos.Roles)
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  @RequerirPermisos(Permisos.Roles)
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRolDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @RequerirPermisos(Permisos.Roles)
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
