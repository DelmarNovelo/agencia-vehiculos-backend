import { Module } from '@nestjs/common';
import { ContactosProveedorService } from './contactos-proveedor.service';
import { ContactosProveedorController } from './contactos-proveedor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactoProveedor } from './entities/contacto-proveedor.entity';

@Module({
  controllers: [ContactosProveedorController],
  providers: [ContactosProveedorService],
  imports: [
    TypeOrmModule.forFeature([
      ContactoProveedor,
    ])
  ]
})
export class ContactosProveedorModule {}
