import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ColoresService } from './colores.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('colores')
@UseGuards(AuthGuard('jwt'))
export class ColoresController {
  constructor(private readonly coloresService: ColoresService) { }

  @Post()
  create(@Body() CreateColorDto: CreateColorDto) {
    return this.coloresService.create(CreateColorDto);
  }

  @Get()
  findAll(
    @Query('searchTerm') searchTerm?: string,
  ) {
    return this.coloresService.findAll(searchTerm!);
  }

  @Get('for-select')
  findAllForSelect() {
    return this.coloresService.findAllForSelect();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coloresService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() UpdateColorDto: UpdateColorDto) {
    return this.coloresService.update(+id, UpdateColorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coloresService.remove(+id);
  }
}
