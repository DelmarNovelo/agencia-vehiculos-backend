import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TransmisionesService } from './transmisiones.service';
import { CreateTransmisionDto } from './dto/create-transmision.dto';
import { UpdateTransmisionDto } from './dto/update-transmision.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('transmisiones')
@UseGuards(AuthGuard('jwt'))
export class TransmisionesController {
  constructor(private readonly transmisionesService: TransmisionesService) { }

  @Post()
  create(@Body() CreateTransmisionDto: CreateTransmisionDto) {
    return this.transmisionesService.create(CreateTransmisionDto);
  }

  @Get()
  findAll(
    @Query('searchTerm') searchTerm?: string,
  ) {
    return this.transmisionesService.findAll(searchTerm!);
  }

  @Get('for-select')
  findAllForSelect() {
    return this.transmisionesService.findAllForSelect();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transmisionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() UpdateTransmisionDto: UpdateTransmisionDto) {
    return this.transmisionesService.update(+id, UpdateTransmisionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transmisionesService.remove(+id);
  }
}
