import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItemsCompraService } from './items-compra.service';
import { CreateItemCompraDto } from './dto/create-item-compra.dto';
import { UpdateItemCompraDto } from './dto/update-item-compra.dto';

@Controller('items-compra')
export class ItemsCompraController {
  constructor(private readonly itemsCompraService: ItemsCompraService) {}

  @Post()
  create(@Body() createItemsCompraDto: CreateItemCompraDto) {
    return this.itemsCompraService.create(createItemsCompraDto);
  }

  @Get()
  findAll() {
    return this.itemsCompraService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsCompraService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemsCompraDto: UpdateItemCompraDto) {
    return this.itemsCompraService.update(+id, updateItemsCompraDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsCompraService.remove(+id);
  }
}
