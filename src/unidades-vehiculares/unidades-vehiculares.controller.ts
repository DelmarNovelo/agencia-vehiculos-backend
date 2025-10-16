import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { UnidadesVehicularesService } from './unidades-vehiculares.service';
import { CreateUnidadVehicularDto } from './dto/create-unidad-vehicular.dto';
import { UpdateUnidadVehicularDto } from './dto/update-unidad-vehicular.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('unidades-vehiculares')
@UseGuards(AuthGuard('jwt'))
export class UnidadesVehicularesController {
  constructor(private readonly unidadesVehicularesService: UnidadesVehicularesService) { }

  @Post(':vehiculoId')
  create(
    @Body() createUnidadVehicularDto: CreateUnidadVehicularDto,
    @Param('vehiculoId') vehiculoId: string,
  ) {
    return this.unidadesVehicularesService.create(createUnidadVehicularDto, +vehiculoId);
  }

  @Get()
  findAll(
    @Query('searchTerm') searchTerm?: string,
  ) {
    return this.unidadesVehicularesService.findAll(searchTerm!);
  }

  @Get('for-select')
  findAllForSelect() {
    return this.unidadesVehicularesService.findAllForSelect();
  }

  @Get('by-vehicle/:vehiculoId')
  findAllByVehicle(
    @Param('vehiculoId') vehiculoId: string,
  ) {
    return this.unidadesVehicularesService.findAllByVehicle(+vehiculoId);
  }

  @Get('by-vehicle-for-sale/:vehiculoId')
  findAllByVehicleForSale(
    @Param('vehiculoId') vehiculoId: string,
  ) {
    return this.unidadesVehicularesService.findAllByVehicleForSale(+vehiculoId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unidadesVehicularesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUnidadVehicularDto: UpdateUnidadVehicularDto) {
    return this.unidadesVehicularesService.update(+id, updateUnidadVehicularDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unidadesVehicularesService.remove(+id);
  }
}
