import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermisosGuard } from 'src/guards/permisos/permisos.guard';
import { RequerirPermisos } from 'src/config/permisos.decorator';
import { Permisos } from 'src/common/enums/permisos.enum';

@Controller('ventas')
@UseGuards(AuthGuard('jwt'), PermisosGuard)
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  @RequerirPermisos(Permisos.CrearVentas)
  create(@Body() createVentaDto: CreateVentaDto) {
    return this.ventasService.create(createVentaDto);
  }

  @Get()
  @RequerirPermisos(Permisos.LeerVentas)
  findAll(@Query('searchTerm') searchTerm?: string) {
    return this.ventasService.findAll(searchTerm);
  }

  @Get(':id')
  @RequerirPermisos(Permisos.LeerVenta)
  findOne(@Param('id') id: string) {
    return this.ventasService.findOne(+id);
  }

  @Get('cliente/:id')
  findByCliente(@Param('id') id: string) {
    return this.ventasService.findByCliente(+id);
  }

}
