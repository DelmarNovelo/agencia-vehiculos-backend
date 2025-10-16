import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ContactosService } from './contactos.service';
import { CreateContactoDto } from './dto/create-contacto.dto';
import { UpdateContactoDto } from './dto/update-contacto.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('contactos')
@UseGuards(AuthGuard('jwt'))
export class ContactosController {
  constructor(private readonly contactosService: ContactosService) {}

  @Post()
  create(@Body() createContactoDto: CreateContactoDto) {
    return this.contactosService.create(createContactoDto);
  }

  @Get('by-owner/:ownerId')
  findByOwner(
    @Param('ownerId') ownerId: string,
    @Query('ownerType') ownerType: 'persona' | 'empresa'
  ) {
    return this.contactosService.findByOwner(+ownerId, ownerType);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContactoDto: UpdateContactoDto) {
    return this.contactosService.update(+id, updateContactoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactosService.remove(+id);
  }
}
