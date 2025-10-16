import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TiposVehiculoService } from './tipos-vehiculo.service';
import { CreateTipoVehiculoDto } from './dto/create-tipo-vehiculo.dto';
import { UpdateTipoVehiculoDto } from './dto/update-tipo-vehiculo.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('tipos-vehiculo')
@UseGuards(AuthGuard('jwt'))
export class TiposVehiculoController {
  constructor(private readonly tiposVehiculoService: TiposVehiculoService) {}

  @Post()
  create(@Body() createTipoVehiculoDto: CreateTipoVehiculoDto) {
    return this.tiposVehiculoService.create(createTipoVehiculoDto);
  }

  @Get()
  findAll(
    @Query('searchTerm') searchTerm?: string,
  ) {
    return this.tiposVehiculoService.findAll(searchTerm!);
  }

  @Get('for-select')
  findAllForSelect() {
    return this.tiposVehiculoService.findAllForSelect();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tiposVehiculoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoVehiculoDto: UpdateTipoVehiculoDto) {
    return this.tiposVehiculoService.update(+id, updateTipoVehiculoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tiposVehiculoService.remove(+id);
  }
}
