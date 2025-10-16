import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TiposPagoService } from './tipos-pago.service';
import { CreateTiposPagoDto } from './dto/create-tipos-pago.dto';
import { UpdateTiposPagoDto } from './dto/update-tipos-pago.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('tipos-pago')
@UseGuards(AuthGuard('jwt'))
export class TiposPagoController {
  constructor(private readonly tiposPagoService: TiposPagoService) {}

  @Post()
  create(@Body() createTiposPagoDto: CreateTiposPagoDto) {
    return this.tiposPagoService.create(createTiposPagoDto);
  }

  @Get()
  findAll(
    @Query('searchTerm') searchTerm?: string,
  ) {
    return this.tiposPagoService.findAll(searchTerm!);
  }

  @Get('for-select')
  findAllForSelect() {
    return this.tiposPagoService.findAllForSelect();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tiposPagoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTiposPagoDto: UpdateTiposPagoDto) {
    return this.tiposPagoService.update(+id, updateTiposPagoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tiposPagoService.remove(+id);
  }
}
