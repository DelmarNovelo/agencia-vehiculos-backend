import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ContactosProveedorService } from './contactos-proveedor.service';
import { CreateContactoProveedorDto } from './dto/create-contacto-proveedor.dto';
import { UpdateContactoProveedorDto } from './dto/update-contacto-proveedor.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('contactos-proveedor')
@UseGuards(AuthGuard('jwt'))
export class ContactosProveedorController {
  constructor(private readonly contactosProveedorService: ContactosProveedorService) { }

  @Post(':proveedorId')
  create(
    @Param('proveedorId') proveedorId: string,
    @Body() createContactosProveedorDto: CreateContactoProveedorDto,
  ) {
    return this.contactosProveedorService.create(+proveedorId, createContactosProveedorDto);
  }

  @Get()
  findAllByProveedor(@Query('proveedorId') proveedorId: string) {
    return this.contactosProveedorService.findAllByProveedor(+proveedorId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactosProveedorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContactosProveedorDto: UpdateContactoProveedorDto) {
    return this.contactosProveedorService.update(+id, updateContactosProveedorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactosProveedorService.remove(+id);
  }
}
