import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { InformesService } from './informes.service';
import { CreateInformeDto } from './dto/create-informe.dto';
import { UpdateInformeDto } from './dto/update-informe.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('informes')
@UseGuards(AuthGuard('jwt'))
export class InformesController {
  constructor(private readonly informesService: InformesService) {}

  @Get('sales-report')
  async getSalesReport(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.informesService.getSalesReport(new Date(startDate), new Date(endDate));
  }

  @Get('top-client')
  async getTopClient(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.informesService.getTopClient(new Date(startDate), new Date(endDate));
  }

  @Get('profit-margin')
  async getProfitMargin(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.informesService.getProfitMargin(new Date(startDate), new Date(endDate));
  }
}
