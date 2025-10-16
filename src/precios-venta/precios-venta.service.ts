import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePrecioVentaDto } from './dto/create-precio-venta.dto';
import { UpdatePrecioVentaDto } from './dto/update-precio-venta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PrecioVenta } from './entities/precio-venta.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PreciosVentaService {
  constructor(
    @InjectRepository(PrecioVenta)
    private readonly precioVentaRepository: Repository<PrecioVenta>,
  ) { }

  async create(createPreciosVentaDto: CreatePrecioVentaDto, vehiculoId: number) {
    const vehiculo = await this.precioVentaRepository.findOne({
      where: { id: vehiculoId },
    });

    if (!vehiculo) {
      throw new NotFoundException(`Vehiculo con id ${vehiculoId} no encontrada`);
    }

    const precioVenta = this.precioVentaRepository.create({ ...createPreciosVentaDto, vehiculo });

    await this.precioVentaRepository.save(precioVenta);

    return { message: 'Precio de venta creado exitosamente' };
  }

  findAll() {
    return `This action returns all preciosVenta`;
  }

  findOne(id: number) {
    return this.precioVentaRepository.findOne({
      where: { id },
      select: ['id', 'precioBase', 'vigenteDesde'],
    });
  }

  async update(id: number, updatePreciosVentaDto: UpdatePrecioVentaDto) {
    const precioVenta = await this.precioVentaRepository.findOne({
      where: { id },
    });

    if (!precioVenta) {
      throw new NotFoundException(`Precio de venta con id ${id} no encontrada`);
    }

    precioVenta.precioBase = updatePreciosVentaDto.precioBase;
    await this.precioVentaRepository.save(precioVenta);

    return { precioBase: precioVenta.precioBase };
  }

}
