import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { VehiculosService } from './vehiculos.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermisosGuard } from 'src/guards/permisos/permisos.guard';
import { RequerirPermisos } from 'src/config/permisos.decorator';
import { Permisos } from 'src/common/enums/permisos.enum';

@Controller('vehiculos')
@UseGuards(AuthGuard('jwt'), PermisosGuard)
export class VehiculosController {
  constructor(private readonly vehiculosService: VehiculosService) {}

  @Post()
  @RequerirPermisos(Permisos.CrearVehiculos)
  create(@Body() createVehiculoDto: CreateVehiculoDto) {
    return this.vehiculosService.create(createVehiculoDto);
  }

  @Get()
  @RequerirPermisos(Permisos.LeerVehiculos)
  findAll(@Query('searchTerm') searchTerm?: string) {
    return this.vehiculosService.findAll(searchTerm);
  }

  @Get('for-autocomplete')
  findAllForAutocomplete(@Query('searchTerm') searchTerm?: string) {
    return this.vehiculosService.findAllForAutocomplete(searchTerm);
  }

  @Get('detalles/:id')
  @RequerirPermisos(Permisos.LeerVehiculo)
  findOneForDetail(@Param('id') id: string) {
    return this.vehiculosService.findOneForDetail(+id);
  }

  @Get(':id')
  @RequerirPermisos(Permisos.LeerVehiculo)
  findOne(@Param('id') id: string) {
    return this.vehiculosService.findOne(+id);
  }

  @Patch(':id')
  @RequerirPermisos(Permisos.EditarVehiculos)
  update(@Param('id') id: string, @Body() updateVehiculoDto: UpdateVehiculoDto) {
    return this.vehiculosService.update(+id, updateVehiculoDto);
  }

  @Delete(':id')
  @RequerirPermisos(Permisos.EliminarVehiculos)
  remove(@Param('id') id: string) {
    return this.vehiculosService.remove(+id);
  }
}
