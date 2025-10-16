import { Controller, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { EmpresasService } from './empresas.service';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('empresas')
@UseGuards(AuthGuard('jwt'))
export class EmpresasController {
  constructor(private readonly empresasService: EmpresasService) {}

  @Get()
  findOne() {
    return this.empresasService.findOne();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmpresaDto: UpdateEmpresaDto) {
    return this.empresasService.update(+id, updateEmpresaDto);
  }

}
