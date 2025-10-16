import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { LineasService } from './lineas.service';
import { CreateLineaDto } from './dto/create-linea.dto';
import { UpdateLineaDto } from './dto/update-linea.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermisosGuard } from 'src/guards/permisos/permisos.guard';
import { RequerirPermisos } from 'src/config/permisos.decorator';
import { Permisos } from 'src/common/enums/permisos.enum';

@Controller('lineas')
@UseGuards(AuthGuard('jwt'), PermisosGuard)
export class LineasController {
  constructor(private readonly lineasService: LineasService) { }

  @Post()
  create(@Body() createLineaDto: CreateLineaDto) {
    return this.lineasService.create(createLineaDto);
  }

  @Get()
  @RequerirPermisos(Permisos.CrearClientes)
  findAll(
    @Query('searchTerm') searchTerm?: string,
  ) {
    return this.lineasService.findAll(searchTerm);
  }

  @Get('for-select/:marcaId')
  findAllForSelect(@Param('marcaId') marcaId: string) {
    return this.lineasService.findAllForSelect(+marcaId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lineasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLineaDto: UpdateLineaDto) {
    return this.lineasService.update(+id, updateLineaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lineasService.remove(+id);
  }
}
