import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { Proveedor } from './entities/proveedor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Persona } from 'src/personas/entities/persona.entity';
import { DataSource, In, Repository } from 'typeorm';
import { ContactoProveedor } from 'src/contactos-proveedor/entities/contacto-proveedor.entity';
import { Direccion } from 'src/direcciones/entities/direccion.entity';
import { Municipio } from 'src/municipios/entities/municipio.entity';
import { TipoContacto } from 'src/tipos-contacto/entities/tipos-contacto.entity';
import { Contacto } from 'src/contactos/entities/contacto.entity';

@Injectable()
export class ProveedoresService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Proveedor)
    private readonly proveedorRepository: Repository<Proveedor>,
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
  ) { }

  async create(createProveedoreDto: CreateProveedorDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { legal, persona, contactos, direccion } = createProveedoreDto;
      const { nombre, apellido, cargo } = persona;
      const { calle, municipioId } = direccion!;
      const { razonSocial, nit } = legal;

      // Proveedor
      const proveedor = queryRunner.manager.create(Proveedor, {
        razonSocial,
        nit,
      });

      const proveedorCreado = await queryRunner.manager.save(proveedor);

      // Direccion
      const municipio = await queryRunner.manager.findOne(Municipio, { where: { id: municipioId } });

      if (!municipio) {
        throw new Error('No se encontró el municipio');
      }

      const nuevaDireccion = queryRunner.manager.create(Direccion, { calle, municipio, proveedor: proveedorCreado });

      await queryRunner.manager.save(nuevaDireccion);

      // Persona y Contacto Proveedor
      const nuevaPersona = queryRunner.manager.create(Persona, {
        nombre,
        apellido,
      });
      const personaCreada = await queryRunner.manager.save(nuevaPersona);

      const contactoProveedor = queryRunner.manager.create(ContactoProveedor, {
        cargo,
        persona: personaCreada,
        proveedor: proveedorCreado,
      });

      await queryRunner.manager.save(contactoProveedor);

      // Contactos
      const tiposContacto = await queryRunner.manager.find(TipoContacto, {
        where: { id: In(contactos.map(contacto => contacto.tipoContactoId)) }
      });

      const nuevosContactos = contactos.map(contacto => {
        const { tipoContactoId, valorContacto } = contacto;
        const tipoContacto = tiposContacto.find(tipo => tipo.id === tipoContactoId);
        if (!tipoContacto) {
          throw new Error('No se encontró el tipo de contacto');
        }
        const nuevoContacto = queryRunner.manager.create(Contacto, { tipoContacto, valorContacto, persona: personaCreada });
        return nuevoContacto;
      });

      await queryRunner.manager.save(nuevosContactos);

      await queryRunner.commitTransaction();

      return { message: 'Proveedor creado exitosamente' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(searchTerm?: string) {
    const queryBuilder = this.proveedorRepository.createQueryBuilder('proveedor')
      .withDeleted()
      .leftJoinAndSelect('proveedor.direccion', 'direccion')
      .leftJoinAndSelect('direccion.municipio', 'municipio')
      .leftJoinAndSelect('municipio.departamento', 'departamento')
      .where('proveedor.deletedAt IS NULL');

    if (searchTerm) {
      queryBuilder.andWhere(
        '(UPPER(proveedor.razonSocial) LIKE UPPER(:search) OR ' +
        'UPPER(proveedor.nit) LIKE UPPER(:search))',
        { search: `%${searchTerm}%` }
      );
    }

    const proveedores = await queryBuilder
      .select([
        'proveedor.id as id',
        'proveedor.razonSocial as razon_social',
        'proveedor.nit as nit',
        'municipio.nombre as municipio',
        'departamento.nombre as departamento',
      ])
      .getRawMany();

    return proveedores.map(p => {
      const { ID, RAZON_SOCIAL, NIT, MUNICIPIO, DEPARTAMENTO } = p;
      return {
        id: ID,
        razonSocial: RAZON_SOCIAL,
        nit: NIT,
        municipio: MUNICIPIO,
        departamento: DEPARTAMENTO,
      }
    });
  }

  async findAllForAutocomplete(searchTerm?: string) {
    const queryBuilder = this.proveedorRepository.createQueryBuilder('proveedor');

    if (searchTerm) {
      queryBuilder.andWhere(
        '(UPPER(proveedor.razonSocial) LIKE UPPER(:search) OR ' +
        'UPPER(proveedor.nit) LIKE UPPER(:search))',
        { search: `%${searchTerm}%` }
      );
    }

    const proveedores = await queryBuilder.getMany();

    return proveedores.map(p => {
      const { id, razonSocial, nit } = p;
      return {
        id,
        label: razonSocial,
        nit,
      }
    });
  }

  async findOne(id: number) {
    const result = await this.proveedorRepository.createQueryBuilder('proveedor')
      .withDeleted()
      .leftJoinAndSelect('proveedor.direccion', 'direccion')
      .leftJoinAndSelect('direccion.municipio', 'municipio')
      .leftJoinAndSelect('municipio.departamento', 'departamento')
      .where('proveedor.id = :id', { id })
      .getOne();

    if (!result) {
      throw new NotFoundException('El proveedor seleccionado no fue encontrado, puede que haya sido eliminado');
    }

    const { direccion, id: idProveedor, nit, razonSocial } = result;
    const { calle, municipio, id: direccionId } = direccion;
    const { nombre: municipioNombre, departamento } = municipio;
    const { nombre: departamentoNombre } = departamento;

    return {
      id: idProveedor,
      nit,
      razonSocial,
      direccion: {
        id: direccionId,
        calle,
        municipio: municipioNombre,
        departamento: departamentoNombre
      }
    };
  }

  async update(id: number, updateProveedoreDto: UpdateProveedorDto) {
    const proveedor = await this.proveedorRepository.findOneBy({ id });

    if (!proveedor) {
      throw new NotFoundException('El proveedor seleccionado no fue encontrado, puede que haya sido eliminado');
    }

    const { razonSocial, nit } = updateProveedoreDto;

    proveedor.razonSocial = razonSocial;
    proveedor.nit = nit;

    await this.proveedorRepository.save(proveedor);

    return { message: 'Proveedor actualizado exitosamente' };
  }

  async remove(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const proveedor = await queryRunner.manager.findOne(Proveedor, {
        where: { id },
        relations: ['direccion', 'contactosProveedor', 'contactosProveedor.persona']
      });

      if (!proveedor) {
        throw new NotFoundException('El proveedor seleccionado no fue encontrado, puede que haya sido eliminado');
      }

      await queryRunner.manager.softDelete(Proveedor, {
        id: proveedor.id
      });

      await queryRunner.manager.softDelete(Persona, {
        id: In(proveedor.contactosProveedor.map(cp => cp.persona.id))
      });

      await queryRunner.manager.softDelete(Direccion, {
        id: proveedor.direccion.id
      });

      await queryRunner.manager.softDelete(Contacto, {
        persona: { id: In(proveedor.contactosProveedor.map(cp => cp.persona.id)) }
      });

      await queryRunner.manager.softDelete(ContactoProveedor, {
        proveedor: { id: In(proveedor.contactosProveedor.map(cp => cp.id)) }
      });

      await queryRunner.commitTransaction();

      return { message: 'Proveedor eliminado exitosamente' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
