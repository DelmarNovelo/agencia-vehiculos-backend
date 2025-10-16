import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { MunicipiosService } from './municipios.service';
import { CreateMunicipioDto } from './dto/create-municipio.dto';
import { UpdateMunicipioDto } from './dto/update-municipio.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('municipios')
@UseGuards(AuthGuard('jwt'))
export class MunicipiosController {
  constructor(private readonly municipiosService: MunicipiosService) { }

  @Post()
  create(@Body() createMunicipioDto: CreateMunicipioDto) {
    return this.municipiosService.create(createMunicipioDto);
  }

  @Get()
  findAll(
    @Query('searchTerm') searchTerm?: string,
  ) {
    return this.municipiosService.findAll(searchTerm!);
  }

  @Get('for-select/:departamentoId')
  findAllForSelect(@Param('departamentoId') departamentoId: string) {
    return this.municipiosService.findAllForSelect(+departamentoId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.municipiosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMunicipioDto: UpdateMunicipioDto) {
    return this.municipiosService.update(+id, updateMunicipioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.municipiosService.remove(+id);
  }
}
