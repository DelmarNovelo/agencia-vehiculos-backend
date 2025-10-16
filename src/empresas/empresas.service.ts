import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Empresa } from './entities/empresa.entity';
import { DataSource, IsNull, Not, Repository } from 'typeorm';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Proveedor } from 'src/proveedores/entities/proveedor.entity';
import { Venta } from 'src/ventas/entities/venta.entity';
import { EstadoFactura } from 'src/ventas/enums/estado-factura.enum';
import { Vehiculo } from 'src/vehiculos/entities/vehiculo.entity';
import { Compra } from 'src/compras/entities/compra.entity';

@Injectable()
export class EmpresasService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
  ) { }

  async findOne() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await queryRunner.manager.createQueryBuilder(Empresa, 'empresa')
        .leftJoinAndSelect('empresa.direccion', 'direccion')
        .leftJoinAndSelect('direccion.municipio', 'municipio')
        .leftJoinAndSelect('municipio.departamento', 'departamento')
        .where('empresa.id >= :id', { id: 1 })
        .getOne();

      if (!result) {
        throw new Error('No se encontró el empresa');
      }

      const vehiculos = await queryRunner.manager.count(Vehiculo, { where: { deletedAt: IsNull() } });
      const clientes = await queryRunner.manager.count(Cliente, { where: { deletedAt: IsNull() } });
      const proveedores = await queryRunner.manager.count(Proveedor, { where: { deletedAt: IsNull() } });
      const ventasResultado = await queryRunner.manager.createQueryBuilder(Venta, 'venta')
        .leftJoinAndSelect('venta.factura', 'factura')
        .select('SUM(venta.total) as total_ventas')
        .addSelect('COUNT(venta.id) as ventas')
        .where('factura.estado = :estado', { estado: EstadoFactura.Pagada })
        .getRawOne();

      const comprasResultado = await queryRunner.manager.createQueryBuilder(Compra, 'compra')
        .leftJoinAndSelect('compra.documento', 'documento')
        .select('SUM(compra.total) as total_compras')
        .addSelect('COUNT(compra.id) as compras')
        .where('documento.estado = :estado', { estado: EstadoFactura.Pagada })
        .getRawOne();

      await queryRunner.commitTransaction();

      const { id: empresaId, direccion, razonSocial, nit } = result;
      const { id: direccionId, calle, municipio } = direccion;
      const { nombre: nombreMunicipio, departamento } = municipio;

      return {
        empresa: {
          id: empresaId,
          razonSocial,
          nit,
        },
        direccion: {
          id: direccionId,
          calle,
          municipio: nombreMunicipio,
          departamento: departamento.nombre
        },
        clientes,
        proveedores,
        vehiculos,
        ventas: {
          totalAmount: ventasResultado.TOTAL_VENTAS ?? 0,
          totalItems: ventasResultado.VENTAS,
        },
        compras: {
          totalAmount: comprasResultado.TOTAL_COMPRAS ?? 0,
          totalItems: comprasResultado.COMPRAS,
        },
      };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, updateEmpresaDto: UpdateEmpresaDto) {
    const { razonSocial, nit } = updateEmpresaDto;

    const empresa = await this.empresaRepository.findOne({
      where: { id }
    });
    
    if (!empresa) {
      throw new NotFoundException(`Empresa con id ${id} no encontrada`);
    }

    empresa.razonSocial = razonSocial;
    empresa.nit = nit;

    await this.empresaRepository.save(empresa);
    return { message: 'Empresa actualizada exitosamente' };
  }

}
