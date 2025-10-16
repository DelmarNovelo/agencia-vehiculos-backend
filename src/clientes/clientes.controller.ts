import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermisosGuard } from 'src/guards/permisos/permisos.guard';
import { RequerirPermisos } from 'src/config/permisos.decorator';
import { Permisos } from 'src/common/enums/permisos.enum';

@Controller('clientes')
@UseGuards(AuthGuard('jwt'), PermisosGuard)
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @RequerirPermisos(Permisos.CrearClientes)
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }

  @Get()
  @RequerirPermisos(Permisos.LeerClientes)
  findAll(@Query('searchTerm') searchTerm?: string) {
    return this.clientesService.findAll(searchTerm);
  }

  @Get('for-autocomplete')
  findAllForAutocomplete(@Query('searchTerm') searchTerm?: string) {
    return this.clientesService.findAllForAutocomplete(searchTerm);
  }

  @Get('for-select')
  findAllForSelect(@Query('searchTerm') searchTerm?: string) {
    return this.clientesService.findAllForSelect(searchTerm);
  }

  @Get(':id')
  @RequerirPermisos(Permisos.LeerCliente)
  findOne(@Param('id') id: string) {
    return this.clientesService.findOne(+id);
  }

  @Get(':id/detalles')
  @RequerirPermisos(Permisos.LeerCliente)
  findOneDetails(@Param('id') id: string) {
    return this.clientesService.findOneDetails(+id);
  }

  @Patch(':id')
  @RequerirPermisos(Permisos.EditarClientes)
  update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clientesService.update(+id, updateClienteDto);
  }

  @Delete(':id')
  @RequerirPermisos(Permisos.EliminarClientes)
  remove(@Param('id') id: string) {
    return this.clientesService.remove(+id);
  }
}
