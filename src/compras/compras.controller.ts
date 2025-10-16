import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ComprasService } from './compras.service';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequerirPermisos } from 'src/config/permisos.decorator';
import { Permisos } from 'src/common/enums/permisos.enum';
import { PermisosGuard } from 'src/guards/permisos/permisos.guard';

@Controller('compras')
@UseGuards(AuthGuard('jwt'), PermisosGuard)
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) {}

  @Post()
  @RequerirPermisos(Permisos.CrearCompras)
  create(@Body() createCompraDto: CreateCompraDto) {
    return this.comprasService.create(createCompraDto);
  }

  @Get()
  @RequerirPermisos(Permisos.LeerCompras)
  findAll(@Query('searchTerm') searchTerm?: string) {
    return this.comprasService.findAll(searchTerm);
  }

  @Get(':id')
  @RequerirPermisos(Permisos.LeerCompra)
  findOne(@Param('id') id: string) {
    return this.comprasService.findOne(+id);
  }

  @Get('proveedor/:id')
  findByProveedor(@Param('id') id: string) {
    return this.comprasService.findByProveedor(+id);
  }
  
}
