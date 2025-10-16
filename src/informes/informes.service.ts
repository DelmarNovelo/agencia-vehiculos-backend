import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInformeDto } from './dto/create-informe.dto';
import { UpdateInformeDto } from './dto/update-informe.dto';
import { Venta } from '../ventas/entities/venta.entity';
import { Compra } from '../compras/entities/compra.entity';
import { Cliente } from '../clientes/entities/cliente.entity';

@Injectable()
export class InformesService {
  constructor(
    @InjectRepository(Venta)
    private ventaRepository: Repository<Venta>,
    @InjectRepository(Compra)
    private compraRepository: Repository<Compra>,
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
  ) {}

  // Métodos para informes optimizados
  async getSalesReport(startDate: Date, endDate: Date) {
    return this.ventaRepository
      .createQueryBuilder('venta')
      .select('SUM(venta.total)', 'totalSales')
      .addSelect('COUNT(venta.id)', 'totalTransactions')
      .where('venta.fecha BETWEEN :start AND :end', { start: startDate, end: endDate })
      .getRawOne();
  }

  async getTopClient(startDate: Date, endDate: Date) {
    return this.ventaRepository
      .createQueryBuilder('venta')
      .select('cliente.id', 'clienteId')
      .addSelect('persona.nombre', 'clienteNombre')
      .addSelect('SUM(venta.total)', 'totalVentas')
      .leftJoin('venta.cliente', 'cliente')
      .leftJoin('cliente.persona', 'persona')
      .where('venta.fecha BETWEEN :start AND :end', { start: startDate, end: endDate })
      .groupBy('cliente.id')
      .addGroupBy('persona.nombre')
      .orderBy('SUM(venta.total)', 'DESC')
      .limit(1)
      .getRawOne();
  }

  async getProfitMargin(startDate: Date, endDate: Date) {
    const sales = await this.ventaRepository
      .createQueryBuilder('venta')
      .select('SUM(venta.total)', 'totalSales')
      .where('venta.fecha BETWEEN :start AND :end', { start: startDate, end: endDate })
      .getRawOne();

    const purchases = await this.compraRepository
      .createQueryBuilder('compra')
      .select('SUM(compra.total)', 'totalPurchases')
      .where('compra.fecha BETWEEN :start AND :end', { start: startDate, end: endDate })
      .getRawOne();

    const totalSales = sales?.totalSales || 0;
    const totalPurchases = purchases?.totalPurchases || 0;
    const profit = totalSales - totalPurchases;
    const margin = totalSales > 0 ? (profit / totalSales) * 100 : 0;

    return { profit, margin, totalSales, totalPurchases };
  }
}
