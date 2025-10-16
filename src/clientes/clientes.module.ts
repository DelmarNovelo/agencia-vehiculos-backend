import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { PersonasModule } from 'src/personas/personas.module';

@Module({
  controllers: [ClientesController],
  providers: [ClientesService],
  imports: [
    TypeOrmModule.forFeature([
      Cliente
    ]),
    PersonasModule,
  ],
  exports: [
    TypeOrmModule,
    ClientesService
  ]
})
export class ClientesModule { }
