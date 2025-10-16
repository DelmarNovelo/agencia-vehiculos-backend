import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PreciosVentaService } from './precios-venta.service';
import { CreatePrecioVentaDto } from './dto/create-precio-venta.dto';
import { UpdatePrecioVentaDto } from './dto/update-precio-venta.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('precios-venta')
@UseGuards(AuthGuard('jwt'))
export class PreciosVentaController {
  constructor(private readonly preciosVentaService: PreciosVentaService) {}

  @Post(':vehiculoId')
  create(
    @Body() createPreciosVentaDto: CreatePrecioVentaDto,
    @Param('vehiculoId') vehiculoId: string,
  ) {
    return this.preciosVentaService.create(createPreciosVentaDto, +vehiculoId);
  }

  @Get()
  findAll() {
    return this.preciosVentaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.preciosVentaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePreciosVentaDto: UpdatePrecioVentaDto) {
    return this.preciosVentaService.update(+id, updatePreciosVentaDto);
  }

}
