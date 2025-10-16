import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TiposContactoService } from './tipos-contacto.service';
import { CreateTipoContactoDto } from './dto/create-tipo-contacto.dto';
import { UpdateTipoContactoDto } from './dto/update-tipo-contacto.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('tipos-contacto')
@UseGuards(AuthGuard('jwt'))
export class TiposContactoController {
  constructor(private readonly tiposContactoService: TiposContactoService) {}

  @Post()
  create(@Body() createTipoContactoDto: CreateTipoContactoDto) {
    return this.tiposContactoService.create(createTipoContactoDto);
  }

  @Get()
  findAll(
    @Query('searchTerm') searchTerm?: string,
  ) {
    return this.tiposContactoService.findAll(searchTerm);
  }

  @Get('for-select')
  findAllForSelect() {
    return this.tiposContactoService.findAllForSelect();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tiposContactoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoContactoDto: UpdateTipoContactoDto) {
    return this.tiposContactoService.update(+id, updateTipoContactoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tiposContactoService.remove(+id);
  }
}
