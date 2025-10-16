import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CompraDocsService } from './compra-docs.service';
import { CreateCompraDocDto } from './dto/create-compra-doc.dto';
import { UpdateCompraDocDto } from './dto/update-compra-doc.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('compra-docs')
@UseGuards(AuthGuard('jwt'))
export class CompraDocsController {
  constructor(private readonly compraDocsService: CompraDocsService) {}

  @Post()
  create(@Body() createCompraDocDto: CreateCompraDocDto) {
    return this.compraDocsService.create(createCompraDocDto);
  }

  @Get()
  findAll() {
    return this.compraDocsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.compraDocsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompraDocDto: UpdateCompraDocDto) {
    return this.compraDocsService.update(+id, updateCompraDocDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.compraDocsService.remove(+id);
  }
}
