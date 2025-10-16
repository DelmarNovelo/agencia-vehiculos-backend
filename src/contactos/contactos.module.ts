import { Module } from '@nestjs/common';
import { ContactosService } from './contactos.service';
import { ContactosController } from './contactos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contacto } from './entities/contacto.entity';
import { TipoContacto } from 'src/tipos-contacto/entities/tipos-contacto.entity';
import { Persona } from 'src/personas/entities/persona.entity';
import { Empresa } from 'src/empresas/entities/empresa.entity';

@Module({
  controllers: [ContactosController],
  providers: [ContactosService],
  imports: [
    TypeOrmModule.forFeature([
      Contacto,
      TipoContacto,
      Persona,
      Empresa,
    ]),
  ],
})
export class ContactosModule {}
