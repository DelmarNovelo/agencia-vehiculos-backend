import { Injectable } from '@nestjs/common';
import { CreateFelDocDto } from './dto/create-fel-doc.dto';
import { UpdateFelDocDto } from './dto/update-fel-doc.dto';

@Injectable()
export class FelDocsService {
  create(createFelDocDto: CreateFelDocDto) {
    return 'This action adds a new felDoc';
  }

  findAll() {
    return `This action returns all felDocs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} felDoc`;
  }

  update(id: number, updateFelDocDto: UpdateFelDocDto) {
    return `This action updates a #${id} felDoc`;
  }

  remove(id: number) {
    return `This action removes a #${id} felDoc`;
  }
}
