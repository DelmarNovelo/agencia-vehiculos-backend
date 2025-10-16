import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermisosGuard } from 'src/guards/permisos/permisos.guard';
import { RequerirPermisos } from 'src/config/permisos.decorator';
import { Permisos } from 'src/common/enums/permisos.enum';

@Controller('proveedores')
@UseGuards(AuthGuard('jwt'), PermisosGuard)
export class ProveedoresController {
  constructor(private readonly proveedoresService: ProveedoresService) { }

  @Post()
  @RequerirPermisos(Permisos.CrearProveedores)
  create(@Body() createProveedoreDto: CreateProveedorDto) {
    return this.proveedoresService.create(createProveedoreDto);
  }

  @Get()
  @RequerirPermisos(Permisos.LeerProveedores)
  findAll(@Query('searchTerm') searchTerm?: string) {
    return this.proveedoresService.findAll(searchTerm);
  }

  @Get('for-autocomplete')
  findAllForAutocomplete(@Query('searchTerm') searchTerm?: string) {
    return this.proveedoresService.findAllForAutocomplete(searchTerm);
  }

  @Get(':id')
  @RequerirPermisos(Permisos.LeerProveedor)
  findOne(@Param('id') id: string) {
    return this.proveedoresService.findOne(+id);
  }

  @Patch(':id')
  @RequerirPermisos(Permisos.EditarProveedores)
  update(@Param('id') id: string, @Body() updateProveedoreDto: UpdateProveedorDto) {
    return this.proveedoresService.update(+id, updateProveedoreDto);
  }

  @Delete(':id')
  @RequerirPermisos(Permisos.EliminarProveedores)
  remove(@Param('id') id: string) {
    return this.proveedoresService.remove(+id);
  }
}
