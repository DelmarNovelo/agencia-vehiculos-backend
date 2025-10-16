import { Injectable } from '@nestjs/common';
import { CreateCompraDocDto } from './dto/create-compra-doc.dto';
import { UpdateCompraDocDto } from './dto/update-compra-doc.dto';

@Injectable()
export class CompraDocsService {
  create(createCompraDocDto: CreateCompraDocDto) {
    return 'This action adds a new compraDoc';
  }

  findAll() {
    return `This action returns all compraDocs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} compraDoc`;
  }

  update(id: number, updateCompraDocDto: UpdateCompraDocDto) {
    return `This action updates a #${id} compraDoc`;
  }

  remove(id: number) {
    return `This action removes a #${id} compraDoc`;
  }
}
