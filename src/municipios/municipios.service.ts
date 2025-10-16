import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMunicipioDto } from './dto/create-municipio.dto';
import { UpdateMunicipioDto } from './dto/update-municipio.dto';
import { Municipio } from './entities/municipio.entity';
import { Departamento } from 'src/departamentos/entities/departamento.entity';

@Injectable()
export class MunicipiosService {
  constructor(
    @InjectRepository(Municipio)
    private readonly municipioRepository: Repository<Municipio>,
    @InjectRepository(Departamento)
    private readonly departamentoRepository: Repository<Departamento>,
  ) { }

  async create(createMunicipioDto: CreateMunicipioDto) {
    const { nombre, departamentoId } = createMunicipioDto;

    const departamento = await this.departamentoRepository.findOne({
      where: { id: departamentoId },
    });

    if (!departamento) {
      throw new NotFoundException(`Departamento con id ${departamentoId} no encontrado`);
    }

    // Validar que no exista otro con mismo nombre que no esté soft deleted
    const existing = await this.municipioRepository.findOne({
      where: { nombre },
      withDeleted: true,
    });
    if (existing && !existing.deletedAt) {
      throw new ConflictException('Ya existe un municipio con ese nombre');
    }

    const municipio = this.municipioRepository.create({ nombre, departamento });
    const municipioCreado = await this.municipioRepository.save(municipio);
    return { id: municipioCreado.id, nombre: municipioCreado.nombre };
  }

  async findAll(searchTerm: string) {
    const municipios = await this.municipioRepository.createQueryBuilder('municipio')
      .withDeleted()
      .where('municipio.deletedAt IS NULL')
      .andWhere('UPPER(municipio.nombre) LIKE UPPER(:search)', { search: `%${searchTerm}%` })
      .leftJoinAndSelect('municipio.departamento', 'departamento')
      .select([
        'municipio.id as id',
        'municipio.nombre as nombre',
        'departamento.nombre as departamento',
      ])
      .orderBy('municipio.nombre', 'ASC')
      .getRawMany();

    return municipios.map(municipio => ({
      id: municipio.ID,
      nombre: municipio.NOMBRE,
      departamento: municipio.DEPARTAMENTO,
    }));
  }

  async findAllForSelect(departamentoId: number) {
    return this.municipioRepository.find({
      where: { departamento: { id: departamentoId } },
      select: ['id', 'nombre'],
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Municipio> {
    const municipio = await this.municipioRepository.findOne({
      where: { id },
      select: ['id', 'nombre'],
    });
    if (!municipio) {
      throw new NotFoundException(`Municipio con id ${id} no encontrado`);
    }
    return municipio;
  }

  async update(id: number, updateMunicipioDto: UpdateMunicipioDto): Promise<Municipio> {
    const municipio = await this.findOne(id);
    const { nombre } = updateMunicipioDto;

    // Validar que no exista otro con mismo nombre que no esté soft deleted, excluyendo el actual
    if (nombre) {
      const existing = await this.municipioRepository.findOne({
        where: { nombre },
        withDeleted: true,
      });
      if (existing && existing.id !== id && !existing.deletedAt) {
        throw new ConflictException('Ya existe un municipio con ese nombre');
      }
    }

    Object.assign(municipio, updateMunicipioDto);
    return this.municipioRepository.save(municipio);
  }

  async remove(id: number): Promise<void> {
    const municipio = await this.findOne(id);
    await this.municipioRepository.softDelete(id);
  }
}
