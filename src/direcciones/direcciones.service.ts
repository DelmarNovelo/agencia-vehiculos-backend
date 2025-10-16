import { Injectable } from '@nestjs/common';
import { CreateDireccionDto } from './dto/create-direccion.dto';
import { UpdateDireccioneDto } from './dto/update-direccione.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Direccion } from './entities/direccion.entity';
import { Repository } from 'typeorm';
import { Municipio } from 'src/municipios/entities/municipio.entity';

@Injectable()
export class DireccionesService {
  constructor(
    @InjectRepository(Direccion)
    private readonly direccionRepository: Repository<Direccion>,
    @InjectRepository(Municipio)
    private readonly municipioRepository: Repository<Municipio>,
  ) { }

  async findOne(id: number) {
    const result = await this.direccionRepository.createQueryBuilder('direccion')
      .leftJoinAndSelect('direccion.municipio', 'municipio')
      .leftJoinAndSelect('municipio.departamento', 'departamento')
      .where('direccion.id = :id', { id })
      .select([
        'direccion.id as id',
        'direccion.calle as calle',
        'municipio.id as municipioId',
        'departamento.id as departamentoId',
      ])
      .getRawOne();

    const { ID, CALLE, MUNICIPIOID, DEPARTAMENTOID } = result;

    return {
      id: ID,
      calle: CALLE,
      municipioId: MUNICIPIOID,
      departamentoId: DEPARTAMENTOID
    }
  }

  async update(id: number, updateDireccioneDto: UpdateDireccioneDto) {
    const { calle, departamentoId, municipioId } = updateDireccioneDto;

    const municipio = await this.municipioRepository.findOne({ where: { id: municipioId } });

    if (!municipio) {
      throw new Error('No se encontró el municipio seleccionado');
    }

    const direccion = await this.direccionRepository.findOne({ where: { id } });

    if (!direccion) {
      throw new Error('No se encontró la dirección seleccionada');
    }
    
    Object.assign(direccion, { calle, municipio });
    await this.direccionRepository.save(direccion);

    return { message: 'Dirección actualizada' };
  }
}
