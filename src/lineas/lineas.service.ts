import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLineaDto } from './dto/create-linea.dto';
import { UpdateLineaDto } from './dto/update-linea.dto';
import { Linea } from './entities/linea.entity';
import { Marca } from 'src/marcas/entities/marca.entity';

@Injectable()
export class LineasService {
  constructor(
    @InjectRepository(Linea)
    private readonly lineaRepository: Repository<Linea>,
    @InjectRepository(Marca)
    private readonly marcaRepository: Repository<Marca>,
  ) { }

  async create(createLineaDto: CreateLineaDto) {
    const { nombre, marcaId } = createLineaDto;

    const marca = await this.marcaRepository.findOneBy({ id: marcaId });

    if (!marca) {
      throw new NotFoundException('La marca seleccionada no fue encontrada, puede que haya sido eliminada');
    }

    // Validar que no exista otro con mismo nombre que no esté soft deleted
    const existing = await this.lineaRepository.findOne({
      where: { nombre, marca: { id: marcaId } },
      withDeleted: true,
    });
    if (existing && !existing.deletedAt) {
      throw new ConflictException('Ya existe una línea con ese nombre asociada a esa marca');
    }

    const linea = this.lineaRepository.create({ nombre, marca });
    const lineaCreada = await this.lineaRepository.save(linea);
    return { id: lineaCreada.id, nombre: lineaCreada.nombre };
  }

  async findAll(searchTerm?: string) {
    return this.lineaRepository.createQueryBuilder('linea')
      .where('UPPER(linea.nombre) LIKE UPPER(:search)', { search: `%${searchTerm}%` })
      .select(['linea.id', 'linea.nombre'])
      .orderBy('linea.nombre', 'ASC')
      .getMany();
  }

  async findAllForSelect(marcaId: number) {
    const lineas = await this.lineaRepository.find({
      where: { marca: { id: marcaId } },
      select: ['id', 'nombre'],
    });

    return lineas.map(linea => ({ id: linea.id, nombre: linea.nombre }));
  }

  async findOne(id: number) {
    const linea = await this.lineaRepository.findOne({
      where: { id },
      relations: ['marca'],
    });
    if (!linea) {
      throw new NotFoundException(`Línea con id ${id} no encontrada`);
    }

    const { id: lineaId, nombre, marca } = linea;

    return {
      id: lineaId,
      nombre,
      marcaId: marca.id,
    };
  }

  async update(id: number, updateLineaDto: UpdateLineaDto): Promise<Linea> {
    const linea = await this.lineaRepository.findOne({
      where: { id },
    });

    if (!linea) {
      throw new NotFoundException(`Línea con id ${id} no encontrada`);
    }

    const { nombre, marcaId } = updateLineaDto;

    const marca = await this.marcaRepository.findOneBy({ id: marcaId });

    if (!marca) {
      throw new NotFoundException('La marca seleccionada no fue encontrada, puede que haya sido eliminada');
    }
    
    if (nombre) {
      const existing = await this.lineaRepository.findOne({
        where: { nombre },
        withDeleted: true,
      });
      if (existing && existing.id !== id && !existing.deletedAt) {
        throw new ConflictException('Ya existe una línea con ese nombre');
      }
    }

    linea.nombre = nombre;
    linea.marca = marca;
    
    return this.lineaRepository.save(linea);
  }

  async remove(id: number): Promise<void> {
    const linea = await this.findOne(id);
    await this.lineaRepository.softDelete(id);
  }
}
