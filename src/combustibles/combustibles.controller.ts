import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CombustiblesService } from './combustibles.service';
import { CreateCombustibleDto } from './dto/create-combustible.dto';
import { UpdateCombustibleDto } from './dto/update-combustible.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('combustibles')
@UseGuards(AuthGuard('jwt'))
export class CombustiblesController {
  constructor(private readonly combustiblesService: CombustiblesService) { }

  @Post()
  create(@Body() createCombustibleDto: CreateCombustibleDto) {
    return this.combustiblesService.create(createCombustibleDto);
  }

  @Get()
  findAll(
    @Query('searchTerm') searchTerm?: string,
  ) {
    return this.combustiblesService.findAll(searchTerm!);
  }

  @Get('for-select')
  findAllForSelect() {
    return this.combustiblesService.findAllForSelect();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.combustiblesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCombustibleDto: UpdateCombustibleDto) {
    return this.combustiblesService.update(+id, updateCombustibleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.combustiblesService.remove(+id);
  }
}
