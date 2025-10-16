import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactoProveedorDto } from './dto/create-contacto-proveedor.dto';
import { UpdateContactoProveedorDto } from './dto/update-contacto-proveedor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactoProveedor } from './entities/contacto-proveedor.entity';
import { DataSource, In, Repository } from 'typeorm';
import { Persona } from 'src/personas/entities/persona.entity';
import { Contacto } from 'src/contactos/entities/contacto.entity';
import { Proveedor } from 'src/proveedores/entities/proveedor.entity';
import { TipoContacto } from 'src/tipos-contacto/entities/tipos-contacto.entity';

@Injectable()
export class ContactosProveedorService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(ContactoProveedor)
    private readonly contactoProveedorRepository: Repository<ContactoProveedor>,
  ) { }

  async create(proveedorId: number, createContactosProveedorDto: CreateContactoProveedorDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { cargo, nombre, apellido } = createContactosProveedorDto.persona;
      const { contactos } = createContactosProveedorDto;

      const proveedor = await queryRunner.manager.findOne(Proveedor, {
        where: { id: proveedorId },
      });

      if (!proveedor) {
        throw new NotFoundException('El proveedor seleccionado no fue encontrado, puede que haya sido eliminado');
      }

      // Persona y Contacto Proveedor
      const nuevaPersona = queryRunner.manager.create(Persona, {
        nombre,
        apellido,
      });
      const personaCreada = await queryRunner.manager.save(nuevaPersona);

      const contactoProveedor = queryRunner.manager.create(ContactoProveedor, {
        cargo,
        persona: personaCreada,
        proveedor,
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

      return { message: 'Contacto de proveedor creado exitosamente' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllByProveedor(proveedorId: number) {
    const result = await this.contactoProveedorRepository.createQueryBuilder('cp')
      .leftJoinAndSelect('cp.persona', 'persona')
      .leftJoinAndSelect('persona.contactos', 'contactos')
      .leftJoinAndSelect('contactos.tipoContacto', 'tipoContacto')
      .where('cp.proveedor.id = :proveedorId', { proveedorId })
      .getMany();

    return result.map(cp => {
      const { id, cargo, persona: { id: personaId, nombre, apellido, contactos } } = cp;

      return {
        id,
        personaId,
        cargo,
        nombreContacto: `${nombre} ${apellido}`,
        contactos: contactos.map(c => ({
          id: c.id,
          tipoContacto: c.tipoContacto.nombre,
          valorContacto: c.valorContacto
        }))
      }
    });
  }

  async findOne(id: number) {
    const result = await this.contactoProveedorRepository.createQueryBuilder('cp')
      .leftJoinAndSelect('cp.persona', 'persona')
      .where('cp.id = :id', { id })
      .getOne();

    if (!result) {
      throw new NotFoundException('El contactoProveedor seleccionado no fue encontrado, puede que haya sido eliminado');
    }

    const { id: cpId, cargo, persona: { nombre, apellido } } = result;

    return {
      id: cpId,
      cargo,
      nombre,
      apellido,
    }
  }

  async update(id: number, updateContactosProveedorDto: UpdateContactoProveedorDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { cargo, nombre, apellido } = updateContactosProveedorDto;

      const cp = await queryRunner.manager.findOne(ContactoProveedor, {
        where: { id },
        relations: ['persona']
      });

      if (!cp) {
        throw new NotFoundException('El contactoProveedor seleccionado no fue encontrado, puede que haya sido eliminado');
      }

      cp.cargo = cargo;

      await queryRunner.manager.save(cp);

      await queryRunner.manager.update(Persona, {
        id: cp.persona.id,
      }, {
        nombre,
        apellido
      });

      await queryRunner.commitTransaction();

      return { message: 'Contacto de proveedor actualizado exitosamente' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cp = await queryRunner.manager.findOne(ContactoProveedor, {
        where: { id },
        relations: ['persona']
      });

      if (!cp) {
        throw new NotFoundException('El contactoProveedor seleccionado no fue encontrado, puede que haya sido eliminado');
      }

      await queryRunner.manager.softDelete(ContactoProveedor, {
        id: cp.id
      });

      await queryRunner.manager.softDelete(Persona, {
        id: cp.persona.id
      });

      await queryRunner.manager.softDelete(Contacto, {
        persona: { id: cp.persona.id }
      });

      await queryRunner.commitTransaction();

      return { message: 'Contacto de proveedor eliminado exitosamente' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
