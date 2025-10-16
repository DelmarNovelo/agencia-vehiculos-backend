import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DireccionesService } from './direcciones.service';
import { UpdateDireccioneDto } from './dto/update-direccione.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('direcciones')
@UseGuards(AuthGuard('jwt'))
export class DireccionesController {
  constructor(private readonly direccionesService: DireccionesService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.direccionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDireccioneDto: UpdateDireccioneDto) {
    return this.direccionesService.update(+id, updateDireccioneDto);
  }
}
