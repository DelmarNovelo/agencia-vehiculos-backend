import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { MetodosPagoService } from './metodos-pago.service';
import { CreateMetodoPagoDto } from './dto/create-metodo-pago.dto';
import { UpdateMetodoPagoDto } from './dto/update-metodo-pago.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('metodos-pago')
@UseGuards(AuthGuard('jwt'))
export class MetodosPagoController {
  constructor(private readonly metodosPagoService: MetodosPagoService) { }

  @Post()
  create(@Body() createMetodosPagoDto: CreateMetodoPagoDto) {
    return this.metodosPagoService.create(createMetodosPagoDto);
  }

  @Get()
  findAll(
    @Query('searchTerm') searchTerm?: string,
  ) {
    return this.metodosPagoService.findAll(searchTerm!);
  }

  @Get('for-select')
  findAllForSelect() {
    return this.metodosPagoService.findAllForSelect();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.metodosPagoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMetodosPagoDto: UpdateMetodoPagoDto) {
    return this.metodosPagoService.update(+id, updateMetodosPagoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.metodosPagoService.remove(+id);
  }
}
