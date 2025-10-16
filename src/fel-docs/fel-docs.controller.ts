import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FelDocsService } from './fel-docs.service';
import { CreateFelDocDto } from './dto/create-fel-doc.dto';
import { UpdateFelDocDto } from './dto/update-fel-doc.dto';

@Controller('fel-docs')
export class FelDocsController {
  constructor(private readonly felDocsService: FelDocsService) {}

  @Post()
  create(@Body() createFelDocDto: CreateFelDocDto) {
    return this.felDocsService.create(createFelDocDto);
  }

  @Get()
  findAll() {
    return this.felDocsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.felDocsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFelDocDto: UpdateFelDocDto) {
    return this.felDocsService.update(+id, updateFelDocDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.felDocsService.remove(+id);
  }
}
