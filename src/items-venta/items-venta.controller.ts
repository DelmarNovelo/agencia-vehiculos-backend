import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItemsVentaService } from './items-venta.service';

@Controller('items-venta')
export class ItemsVentaController {
  constructor(private readonly itemsVentaService: ItemsVentaService) {}


}
