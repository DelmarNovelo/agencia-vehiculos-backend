import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Like, Repository } from 'typeorm';
import { PaginationQuery } from 'src/common/interfaces/pagination-query.interface';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { Marca } from './entities/marca.entity';
import { Linea } from 'src/lineas/entities/linea.entity';

@Injectable()
export class MarcasService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Marca)
    private readonly marcaRepository: Repository<Marca>,
    @InjectRepository(Linea)
    private readonly lineaRepository: Repository<Linea>,
  ) { }

  async create(createMarcaDto: CreateMarcaDto) {
    const { nombre, lineas } = createMarcaDto;

    // Validar que no exista otro con mismo nombre que no esté soft deleted
    const existing = await this.marcaRepository.findOne({
      where: { nombre },
      withDeleted: true,
    });
    if (existing && !existing.deletedAt) {
      throw new ConflictException('Ya existe una marca con ese nombre');
    }

    const nuevasLineas = lineas.map(linea => this.lineaRepository.create({ nombre: linea }));

    const nuevaMarca = this.marcaRepository.create({ nombre, lineas: nuevasLineas });
    const marcaCreada = await this.marcaRepository.save(nuevaMarca);
    return {
      id: marcaCreada.id,
      nombre: marcaCreada.nombre,
      lineas: marcaCreada.lineas.map(linea => ({ id: linea.id, nombre: linea.nombre })),
    };
  }

  async findAll(searchTerm?: string) {
    return this.marcaRepository.createQueryBuilder('marca')
      .where('UPPER(marca.nombre) LIKE UPPER(:search)', { search: `%${searchTerm}%` })
      .select(['marca.id', 'marca.nombre'])
      .orderBy('marca.nombre', 'ASC')
      .getMany();
  }

  async findAllForSelect() {
    const marcas = await this.marcaRepository.find({
    });

    return marcas.map(marca => ({ id: marca.id, nombre: marca.nombre }));
  }

  async findOne(id: number): Promise<Marca> {
    const marca = await this.marcaRepository.findOne({
      where: { id },
    });
    
    if (!marca) {
      throw new NotFoundException(`Marca con id ${id} no encontrada`);
    }
    return marca;
  }

  async update(id: number, updateMarcaDto: UpdateMarcaDto): Promise<Marca> {
    const marca = await this.findOne(id);
    const { nombre } = updateMarcaDto;

    // Validar que no exista otro con mismo nombre que no esté soft deleted, excluyendo el actual
    if (nombre) {
      const existing = await this.marcaRepository.findOne({
        where: { nombre },
        withDeleted: true,
      });
      if (existing && existing.id !== id && !existing.deletedAt) {
        throw new ConflictException('Ya existe una marca con ese nombre');
      }
    }

    Object.assign(marca, updateMarcaDto);
    return this.marcaRepository.save(marca);
  }

  async remove(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const marca = await queryRunner.manager.findOne(Marca, {
        where: { id },
      });

      if (!marca) {
        throw new NotFoundException('Marca no encontrada');
      }

      await queryRunner.manager.softDelete(Marca, {
        id: marca.id
      });

      await queryRunner.manager.softDelete(Linea, {
        marca: { id: marca.id }
      });

      await queryRunner.commitTransaction();

      return { message: 'Marca eliminada exitosamente' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
