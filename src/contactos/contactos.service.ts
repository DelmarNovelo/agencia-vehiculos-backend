import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContactoDto } from './dto/create-contacto.dto';
import { UpdateContactoDto } from './dto/update-contacto.dto';
import { Contacto } from './entities/contacto.entity';
import { TipoContacto } from 'src/tipos-contacto/entities/tipos-contacto.entity';
import { Persona } from 'src/personas/entities/persona.entity';
import { Empresa } from 'src/empresas/entities/empresa.entity';

@Injectable()
export class ContactosService {
  constructor(
    @InjectRepository(Contacto)
    private readonly contactoRepository: Repository<Contacto>,
    @InjectRepository(TipoContacto)
    private readonly tipoContactoRepository: Repository<TipoContacto>,
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
  ) { }

  async create(createContactoDto: CreateContactoDto) {
    const { tipoContactoId, valorContacto, ownerId, ownerType } = createContactoDto;

    // Validar que el tipo de contacto existe
    const tipoContacto = await this.tipoContactoRepository.findOneBy({ id: tipoContactoId });
    if (!tipoContacto) {
      throw new NotFoundException('Tipo de contacto no encontrado');
    }

    const contacto = new Contacto();
    contacto.valorContacto = valorContacto;
    contacto.tipoContacto = tipoContacto;

    // Validar y obtener la entidad propietaria según el tipo
    let persona: Persona | null = null;
    let empresa: Empresa | null = null;

    if (ownerType === 'persona') {
      persona = await this.personaRepository.findOneBy({ id: ownerId });
      if (!persona) {
        throw new NotFoundException('Persona no encontrada');
      }

      contacto.persona = persona;
    } else if (ownerType === 'empresa') {
      empresa = await this.empresaRepository.findOneBy({ id: ownerId });
      if (!empresa) {
        throw new NotFoundException('Empresa no encontrada');
      }

      contacto.empresa = empresa;
    } else {
      throw new BadRequestException('Tipo de propietario inválido. Debe ser "persona" o "empresa"');
    }

    const contactoGuardado = await this.contactoRepository.save(contacto);
    return {
      id: contactoGuardado.id,
      valorContacto: contactoGuardado.valorContacto,
      tipoContacto: {
        id: tipoContacto.id,
        nombre: tipoContacto.nombre,
      },
    };
  }

  async findByOwner(ownerId: number, ownerType: 'persona' | 'empresa') {
    const whereCondition = ownerType === 'persona'
      ? { persona: { id: ownerId } }
      : { empresa: { id: ownerId } };

    const result = await this.contactoRepository.find({
      where: whereCondition,
      relations: ['tipoContacto'],
      select: {
        id: true,
        valorContacto: true,
        tipoContacto: {
          id: true,
          nombre: true,
        },
      },
      order: { tipoContacto: { nombre: 'ASC' } },
    });

    return result.map(contacto => ({
      id: contacto.id,
      valorContacto: contacto.valorContacto,
      tipoContacto: contacto.tipoContacto.nombre
    }));
  }

  async findOne(id: number) {
    const contacto = await this.contactoRepository.findOne({
      where: { id },
      relations: ['tipoContacto'],
      select: {
        id: true,
        valorContacto: true,
        tipoContacto: {
          id: true,
          nombre: true,
        },
      },
    });

    if (!contacto) {
      throw new NotFoundException(`Contacto con id ${id} no encontrado`);
    }

    const { id: contactoId, valorContacto, tipoContacto } = contacto;

    return {
      id: contactoId,
      valorContacto,
      tipoContactoId: tipoContacto.id
    };
  }

  async update(id: number, updateContactoDto: UpdateContactoDto) {
    const contacto = await this.contactoRepository.findOneBy({ id });
    if (!contacto) {
      throw new NotFoundException(`Contacto con id ${id} no encontrado`);
    }

    const { tipoContactoId, valorContacto } = updateContactoDto;

    if (tipoContactoId) {
      const tipoContacto = await this.tipoContactoRepository.findOneBy({ id: tipoContactoId });
      if (!tipoContacto) {
        throw new NotFoundException('Tipo de contacto no encontrado');
      }
      contacto.tipoContacto = tipoContacto;
    }

    if (valorContacto) {
      contacto.valorContacto = valorContacto;
    }

    await this.contactoRepository.save(contacto);
    return { message: 'Contacto actualizado exitosamente' };
  }

  async remove(id: number) {
    const contacto = await this.contactoRepository.findOneBy({ id });
    if (!contacto) {
      throw new NotFoundException(`Contacto con id ${id} no encontrado`);
    }

    await this.contactoRepository.softDelete(id);
    return { message: 'Contacto eliminado exitosamente' };
  }
}
