import { Injectable } from '@nestjs/common';
import { CreateItemCompraDto } from './dto/create-item-compra.dto';
import { UpdateItemCompraDto } from './dto/update-item-compra.dto';

@Injectable()
export class ItemsCompraService {
  create(createItemsCompraDto: CreateItemCompraDto) {
    return 'This action adds a new itemsCompra';
  }

  findAll() {
    return `This action returns all itemsCompra`;
  }

  findOne(id: number) {
    return `This action returns a #${id} itemsCompra`;
  }

  update(id: number, updateItemsCompraDto: UpdateItemCompraDto) {
    return `This action updates a #${id} itemsCompra`;
  }

  remove(id: number) {
    return `This action removes a #${id} itemsCompra`;
  }
}
