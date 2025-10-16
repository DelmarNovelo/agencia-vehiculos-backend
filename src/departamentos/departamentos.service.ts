import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Like, Repository } from 'typeorm';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';
import { UpdateDepartamentoDto } from './dto/update-departamento.dto';
import { Departamento } from './entities/departamento.entity';
import { Municipio } from 'src/municipios/entities/municipio.entity';

@Injectable()
export class DepartamentosService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Departamento)
    private readonly departamentoRepository: Repository<Departamento>,
    @InjectRepository(Municipio)
    private readonly municipioRepository: Repository<Municipio>,
  ) { }

  async create(createDepartamentoDto: CreateDepartamentoDto) {
    const { nombre, municipios } = createDepartamentoDto;

    // Validar que no exista otro con mismo nombre que no esté soft deleted
    const existing = await this.departamentoRepository.findOne({
      where: { nombre },
      withDeleted: true,
    });
    if (existing && !existing.deletedAt) {
      throw new ConflictException('Ya existe un departamento con ese nombre');
    }

    const nuevosMunicipios = municipios.map(municipio => this.municipioRepository.create({ nombre: municipio }));

    const departamento = this.departamentoRepository.create({ nombre, municipios: nuevosMunicipios });

    const deptoCreado = await this.departamentoRepository.save(departamento);
    return {
      id: deptoCreado.id,
      nombre: deptoCreado.nombre,
      municipios: deptoCreado.municipios.map(municipio => ({ id: municipio.id, nombre: municipio.nombre })),
    }
  }

  async findAll(searchTerm: string) {
    return this.departamentoRepository
      .createQueryBuilder('departamento')
      .where('departamento.deletedAt IS NULL')  // Filtrar soft deletes
      .andWhere('LOWER(departamento.nombre) LIKE LOWER(:nombre)', { nombre: `%${searchTerm}%` })
      .select(['departamento.id', 'departamento.nombre'])
      .orderBy('departamento.nombre', 'ASC')
      .getMany();
  }

  async findAllForSelect() {
    return this.departamentoRepository.find({
      select: ['id', 'nombre'],
    });
  }

  async findOne(id: number) {
    const departamento = await this.departamentoRepository.findOne({
      where: { id },
      select: ['id', 'nombre'],
    });
    if (!departamento) {
      throw new NotFoundException(`Departamento con id ${id} no encontrado`);
    }
    return departamento;
  }

  async update(id: number, updateDepartamentoDto: UpdateDepartamentoDto): Promise<Departamento> {
    const departamento = await this.findOne(id);
    const { nombre } = updateDepartamentoDto;

    // Validar que no exista otro con mismo nombre que no esté soft deleted, excluyendo el actual
    if (nombre) {
      const existing = await this.departamentoRepository.findOne({
        where: { nombre },
        withDeleted: true,
      });
      if (existing && existing.id !== id && !existing.deletedAt) {
        throw new ConflictException('Ya existe un departamento con ese nombre');
      }
    }

    Object.assign(departamento, updateDepartamentoDto);
    return this.departamentoRepository.save(departamento);
  }

  async remove(id: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const departamento = await queryRunner.manager.findOne(Departamento, {
        where: { id },
        relations: ['municipios'],
      });

      if (!departamento) {
        throw new NotFoundException(`Departamento con id ${id} no encontrado`);
      }

      // Soft delete del departamento
      await queryRunner.manager.softDelete(Departamento, id);

      // Soft delete de todos los municipios asociados
      if (departamento.municipios && departamento.municipios.length > 0) {
        await queryRunner.manager.softDelete(Municipio, {
          id: In(departamento.municipios.map(municipio => municipio.id))
        });
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
