import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { DataSource, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Persona } from 'src/personas/entities/persona.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { Contacto } from 'src/contactos/entities/contacto.entity';
import { Municipio } from 'src/municipios/entities/municipio.entity';
import { Direccion } from 'src/direcciones/entities/direccion.entity';
import { TipoContacto } from 'src/tipos-contacto/entities/tipos-contacto.entity';
import { hashSync } from 'bcrypt';
import { Rol } from 'src/roles/entities/rol.entity';
import { format } from 'date-fns';

@Injectable()
export class UsuariosService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) { }

  async create(createUsuarioDto: CreateUsuarioDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { persona, empleado, direccion, contactos } = createUsuarioDto;
      const { nombre, apellido, dpi, nit } = persona;
      const { email, password, rolId, fechaContratacion } = empleado;
      const { calle, municipioId } = direccion!;

      // Persona
      const nuevaPersona = queryRunner.manager.create(Persona, {
        nombre,
        apellido,
        dpi,
        nit,
      });

      const personaCreada = await queryRunner.manager.save(nuevaPersona);

      const rol = await queryRunner.manager.findOne(Rol, { where: { id: rolId } });

      if (!rol) {
        throw new Error('No se encontró el rol seleccionado');
      }

      // Usuario
      const nuevoUsuario = queryRunner.manager.create(Usuario, {
        email,
        password: hashSync(password, 10),
        persona: personaCreada,
        roles: [rol]
      });

      await queryRunner.manager.save(nuevoUsuario);

      // Empleado
      const nuevoEmpleado = queryRunner.manager.create(Empleado, {
        fechaContratacion: format(new Date(fechaContratacion), 'yyyy-MM-dd'),
        persona: personaCreada,
      });

      await queryRunner.manager.save(nuevoEmpleado);

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

      return { message: 'Usuario creado correctamente' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(searchTerm?: string) {
    const usuarios = await this.usuarioRepository.createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.persona', 'persona')
      .where(
        '(UPPER(persona.nombre) LIKE UPPER(:search) OR ' +
        'UPPER(persona.apellido) LIKE UPPER(:search) OR ' +
        'persona.dpi LIKE :search OR ' +
        'persona.nit LIKE :search)',
        { search: `%${searchTerm}%` }
      )
      .getMany();

    return usuarios.map(usuario => {
      const { id, email, persona: { nombre, apellido } } = usuario;

      return {
        id,
        nombre,
        apellido,
        email,
      }
    });
  }

  async findOne(id: number) {
    const result = await this.usuarioRepository.createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.roles', 'roles')
      .leftJoinAndSelect('usuario.persona', 'persona')
      .leftJoinAndSelect('persona.empleado', 'empleado')
      .leftJoinAndSelect('persona.direccion', 'direccion')
      .leftJoinAndSelect('direccion.municipio', 'municipio')
      .leftJoinAndSelect('municipio.departamento', 'departamento')
      .leftJoinAndSelect('persona.contactos', 'contactos')
      .where('usuario.id = :id', { id })
      .getOne();

    if (!result) {
      throw new NotFoundException('El usuario seleccionado no fue encontrado, puede que haya sido eliminado');
    }

    const { persona, roles, email } = result;
    const { nombre, apellido, dpi, nit, direccion, empleado, id: personaId } = persona;
    const { calle, municipio, id: direccionId } = direccion;
    const { nombre: municipioNombre, departamento } = municipio;
    const { nombre: departamentoNombre } = departamento;
    const rol = roles[0];

    const usuario = {
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
      empleado: {
        email,
        fechaContratacion: empleado?.fechaContratacion || '',
        rol: {
          nombre: rol.nombre,
          descripcion: rol.descripcion
        }
      }
    }

    return usuario;
  }

  async findOneDetails(id: number) {
    const usuario = await this.usuarioRepository.createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.roles', 'roles')
      .leftJoinAndSelect('usuario.persona', 'persona')
      .leftJoinAndSelect('persona.empleado', 'empleado')
      .where('usuario.id = :id', { id })
      .getOne();

    if (!usuario) {
      throw new NotFoundException('El usuario seleccionado no fue encontrado, puede que haya sido eliminado');
    }

    const { id: usuarioId, persona, email, roles } = usuario;
    const { nombre, apellido, dpi, nit, empleado } = persona;
    const rol = roles[0];

    return {
      id: usuarioId,
      persona: {
        nombre,
        apellido,
        dpi,
        nit,
      },
      empleado: {
        email,
        fechaContratacion: empleado?.fechaContratacion || '',
        rolId: rol.id
      }
    };
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { persona, empleado } = updateUsuarioDto;
      const { email, rolId, fechaContratacion } = empleado;

      const usuario = await queryRunner.manager.findOne(Usuario, {
        where: { id },
        relations: ['persona', 'persona.empleado', 'roles']
      });

      if (!usuario) {
        throw new NotFoundException('El usuario seleccionado no fue encontrado, puede que haya sido eliminado');
      }

      const rol = await queryRunner.manager.findOne(Rol, { where: { id: rolId } });

      if (!rol) {
        throw new Error('No se encontró el rol seleccionado');
      }

      usuario.roles[0] = rol;
      usuario.email = email;
      usuario.persona.empleado.fechaContratacion = format(new Date(fechaContratacion), 'yyyy-MM-dd');
      Object.assign(usuario.persona, persona);
      await queryRunner.manager.save(usuario);

      await queryRunner.commitTransaction();

      return { message: 'Usuario actualizado' };
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
      const usuario = await queryRunner.manager.findOne(Usuario, {
        where: { id },
        relations: ['persona', 'persona.empleado', 'persona.contactos', 'persona.direccion']
      });

      if (!usuario) {
        throw new NotFoundException('El usuario seleccionado no fue encontrado, puede que haya sido eliminado');
      }

      if (!usuario.canBeDeleted) {
        throw new BadRequestException('El usuario administrador no puede ser eliminado');
      }

      // Persona
      await queryRunner.manager.softDelete(Persona, {
        id: usuario.persona.id
      });

      // Usuario
      await queryRunner.manager.softDelete(Usuario, {
        id: usuario.id
      });

      // Empleado
      if (usuario.persona.empleado) {
        await queryRunner.manager.softDelete(Empleado, {
          id: usuario.persona.empleado.id
        });
      }

      // Direccion
      if (usuario.persona.direccion) {
        await queryRunner.manager.softDelete(Direccion, {
          id: usuario.persona.direccion.id
        });
      }
      
      // Contactos
      await queryRunner.manager.softDelete(Contacto, {
        persona: { id: usuario.persona.id }
      });

      await queryRunner.commitTransaction();

      return { message: 'Usuario eliminado exitosamente' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
