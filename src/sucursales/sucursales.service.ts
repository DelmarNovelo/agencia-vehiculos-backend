import { Injectable } from '@nestjs/common';
import { CreateSucursaleDto } from './dto/create-sucursal.dto';
import { UpdateSucursaleDto } from './dto/update-sucursal.dto';

@Injectable()
export class SucursalesService {
  create(createSucursaleDto: CreateSucursaleDto) {
    return 'This action adds a new sucursale';
  }

  findAll() {
    return `This action returns all sucursales`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sucursale`;
  }

  update(id: number, updateSucursaleDto: UpdateSucursaleDto) {
    return `This action updates a #${id} sucursale`;
  }

  remove(id: number) {
    return `This action removes a #${id} sucursale`;
  }
}
