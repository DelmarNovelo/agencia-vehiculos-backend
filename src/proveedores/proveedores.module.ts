import { Module } from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { ProveedoresController } from './proveedores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proveedor } from './entities/proveedor.entity';
import { PersonasModule } from 'src/personas/personas.module';

@Module({
  controllers: [ProveedoresController],
  providers: [ProveedoresService],
  imports: [
    TypeOrmModule.forFeature([
      Proveedor
    ]),
    PersonasModule,
  ],
  exports: [
    TypeOrmModule,
    ProveedoresService,
  ]
})
export class ProveedoresModule {}
