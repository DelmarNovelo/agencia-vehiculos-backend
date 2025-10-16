import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { DataSource, In, Repository } from 'typeorm';
import { Persona } from 'src/personas/entities/persona.entity';
import { Direccion } from 'src/direcciones/entities/direccion.entity';
import { Contacto } from 'src/contactos/entities/contacto.entity';
import { TipoContacto } from 'src/tipos-contacto/entities/tipos-contacto.entity';
import { Municipio } from 'src/municipios/entities/municipio.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';

@Injectable()
export class ClientesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
  ) { }

  async create(createClienteDto: CreateClienteDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { persona, direccion, contactos } = createClienteDto;
      const { nombre, apellido, dpi, nit } = persona;
      const { calle, municipioId } = direccion!;

      // Persona
      const nuevaPersona = queryRunner.manager.create(Persona, {
        nombre,
        apellido,
        dpi,
        nit,
      });

      const personaCreada = await queryRunner.manager.save(nuevaPersona);

      // Cliente
      const nuevoCliente = queryRunner.manager.create(Cliente, { persona: personaCreada });

      await queryRunner.manager.save(nuevoCliente);

      // Direccion
      const municipio = await queryRunner.manager.findOne(Municipio, { where: { id: municipioId } });

      if (!municipio) {
        throw new Error('No se encontró el municipio');
      }

      const nuevaDireccion = queryRunner.manager.create(Direccion, { calle, municipio, persona: personaCreada });
      await queryRunner.manager.save(nuevaDireccion);

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

      return { message: 'Cliente creado correctamente' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(searchTerm?: string) {
    const queryBuilder = this.clienteRepository.createQueryBuilder('cliente')
      .leftJoinAndSelect('cliente.persona', 'persona')
      .leftJoinAndSelect('persona.contactos', 'contactos')
      .where('cliente.deletedAt IS NULL');

    if (searchTerm) {
      queryBuilder.andWhere(
        '(UPPER(persona.nombre) LIKE UPPER(:search) OR ' +
        'UPPER(persona.apellido) LIKE UPPER(:search) OR ' +
        'persona.dpi LIKE :search OR ' +
        'persona.nit LIKE :search)',
        { search: `%${searchTerm}%` }
      );
    }

    const clientes = await queryBuilder.getMany();

    return clientes.map(cliente => {
      const { nombre, apellido, dpi, nit } = cliente.persona;

      return {
        id: cliente.id,
        nombre,
        apellido,
        dpi,
        nit,
      }
    });
  }

  async findAllForAutocomplete(searchTerm?: string) {
    const queryBuilder = this.clienteRepository.createQueryBuilder('cliente')
      .leftJoinAndSelect('cliente.persona', 'persona')
      .leftJoinAndSelect('persona.contactos', 'contactos')
      .where('cliente.deletedAt IS NULL');

    if (searchTerm) {
      queryBuilder.andWhere(
        '(CONCAT(CONCAT(UPPER(persona.nombre), \' \'), UPPER(persona.apellido)) LIKE UPPER(:search) OR ' +
        'UPPER(persona.nombre) LIKE UPPER(:search) OR ' +
        'UPPER(persona.apellido) LIKE UPPER(:search) OR ' +
        'persona.dpi LIKE :search OR ' +
        'persona.nit LIKE :search)',
        { search: `%${searchTerm}%` }
      );
    }

    const clientes = await queryBuilder.getMany();

    return clientes.map(cliente => {
      const { nombre, apellido, dpi, nit } = cliente.persona;

      return {
        id: cliente.id,
        label: `${nombre} ${apellido}`,
        dpi,
        nit,
      }
    });
  }

  async findAllForSelect(searchTerm?: string) {
    const queryBuilder = this.clienteRepository.createQueryBuilder('cliente')
      .leftJoin('cliente.persona', 'persona')
      .where('cliente.deletedAt IS NULL')
      .select([
        'cliente.id',
        'persona.nombre',
        'persona.apellido',
        'persona.dpi',
        'persona.nit'
      ]);

    if (searchTerm) {
      queryBuilder.andWhere(
        '(UPPER(persona.nombre) LIKE UPPER(:search) OR ' +
        'UPPER(persona.apellido) LIKE UPPER(:search) OR ' +
        'persona.dpi LIKE :search)',
        { search: `%${searchTerm}%` }
      );
    }

    const clientes = await queryBuilder.getMany();

    return clientes.map(cliente => ({
      id: cliente.id,
      nombre: `${cliente.persona.nombre} ${cliente.persona.apellido}`,
      dpi: cliente.persona.dpi,
      nit: cliente.persona.nit
    }));
  }

  async findOne(id: number) {
    const result = await this.clienteRepository.createQueryBuilder('cliente')
      .leftJoinAndSelect('cliente.persona', 'persona')
      .leftJoinAndSelect('persona.direccion', 'direccion')
      .leftJoinAndSelect('direccion.municipio', 'municipio')
      .leftJoinAndSelect('municipio.departamento', 'departamento')
      .leftJoinAndSelect('persona.contactos', 'contactos')
      .where('cliente.id = :id', { id })
      .getOne();

    if (!result) {
      throw new NotFoundException('El cliente seleccionado no fue encontrado, puede que haya sido eliminado');
    }

    const { nombre, apellido, dpi, nit, direccion, id: personaId } = result.persona;
    const { calle, municipio, id: direccionId } = direccion;
    const { nombre: municipioNombre, departamento } = municipio;
    const { nombre: departamentoNombre } = departamento;

    const cliente = {
      id: result.id,
      persona: {
        id: personaId,
        nombre,
        apellido,
        dpi,
        nit,
      },
      direccion: {
        id: direccionId,
        calle,
        municipio: municipioNombre,
        departamento: departamentoNombre
      },
    }

    return cliente;
  }

  async findOneDetails(id: number) {
    const cliente = await this.clienteRepository.createQueryBuilder('cliente')
      .leftJoinAndSelect('cliente.persona', 'persona')
      .where('cliente.id = :id', { id })
      .select([
        'cliente.id',
        'persona.nombre',
        'persona.apellido',
        'persona.dpi',
        'persona.nit',
      ])
      .getOne();

    if (!cliente) {
      throw new NotFoundException('El cliente seleccionado no fue encontrado, puede que haya sido eliminado');
    }

    const { id: clienteId, persona } = cliente;
    const { nombre, apellido, dpi, nit } = persona;

    return {
      id: clienteId,
      nombre,
      apellido,
      dpi,
      nit,
    };
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    const cliente = await this.clienteRepository.findOne({
      where: { id },
      relations: ['persona']
    });

    if (!cliente) {
      throw new NotFoundException('El cliente seleccionado no fue encontrado, puede que haya sido eliminado');
    }

    const persona = cliente.persona;
    Object.assign(persona, updateClienteDto);

    await this.personaRepository.save(persona);

    return { message: 'Cliente actualizado' };
  }

  async remove(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cliente = await queryRunner.manager.findOne(Cliente, {
        where: { id },
        relations: ['persona']
      });

      if (!cliente) {
        throw new NotFoundException('El cliente seleccionado no fue encontrado, puede que haya sido eliminado');
      }

      await queryRunner.manager.softDelete(Cliente, {
        id: cliente.id
      });

      await queryRunner.manager.softDelete(Persona, {
        id: cliente.persona.id
      });

      await queryRunner.manager.softDelete(Direccion, {
        persona: { id: cliente.persona.id }
      });

      await queryRunner.manager.softDelete(Contacto, {
        persona: { id: cliente.persona.id }
      });

      await queryRunner.commitTransaction();

      return { message: 'Cliente eliminado exitosamente' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
