import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { DataSource, In, Repository } from 'typeorm';
import { Proveedor } from 'src/proveedores/entities/proveedor.entity';
import { MetodoPago } from 'src/metodos-pago/entities/metodo-pago.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Vehiculo } from 'src/vehiculos/entities/vehiculo.entity';
import { UnidadVehicular } from 'src/unidades-vehiculares/entities/unidad-vehicular.entity';
import { ItemCompra } from 'src/items-compra/entities/item-compra.entity';
import { Compra } from './entities/compra.entity';
import { CompraDoc } from 'src/compra-docs/entities/compra-doc.entity';
import { format } from 'date-fns';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ComprasService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Compra)
    private readonly compraRepository: Repository<Compra>,
  ) { }

  async create(createCompraDto: CreateCompraDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { proveedorId, compra, documento, items } = createCompraDto;
      const { metodoPagoId, notas, tipoCompra } = compra;
      const { tipoDocumento, numDocumento, fechaEmision } = documento;

      const proveedor = await queryRunner.manager.findOne(Proveedor, {
        where: { id: proveedorId }
      });

      if (!proveedor) {
        throw new NotFoundException('Proveedor no encontrado');
      }

      const metodoPago = await queryRunner.manager.findOneBy(MetodoPago, { id: metodoPagoId });

      if (!metodoPago) {
        throw new NotFoundException('Metodo de pago no encontrado');
      }

      const usuario = await queryRunner.manager.findOne(Usuario, {
        where: { id: 1 }
      });

      const vehiculos = await queryRunner.manager.find(Vehiculo, {
        where: { id: In(items.map(item => item.vehiculoId)) }
      });

      const itemsCompra: ItemCompra[] = [];
      let subtotalT = 0;
      let descuentoT = 0;
      let totalT = 0;

      for (const item of items) {
        const { vin, descuento, precioCompra, vehiculoId } = item;
        const vehiculo = vehiculos.find(v => v.id === vehiculoId);

        const nuevaUnidad = queryRunner.manager.create(UnidadVehicular, {
          vin, vehiculo
        });

        const unidadGuardada = await queryRunner.manager.save(nuevaUnidad);

        const nuevoItemCompra = queryRunner.manager.create(ItemCompra, {
          costoUnitario: precioCompra,
          descuento,
          costoFinal: precioCompra - descuento,
          vehiculo,
          unidadVehicular: unidadGuardada,
        });

        itemsCompra.push(nuevoItemCompra);

        subtotalT += precioCompra;
        descuentoT += descuento;
        totalT += precioCompra - descuento;
      }

      const nuevaCompra = queryRunner.manager.create(Compra, {
        fecha: new Date(),
        subtotal: subtotalT,
        total: totalT,
        descuento: descuentoT,
        proveedor,
        metodoPago,
        itemsCompra,
        tipoCompra,
        notas,
      });

      const compraGuardada = await queryRunner.manager.save(nuevaCompra);

      const nuevaCompraDoc = queryRunner.manager.create(CompraDoc, {
        numDocumento,
        tipoDocumento,
        fechaEmision: format(new Date(fechaEmision), 'yyyy-MM-dd'),
        compra: compraGuardada,
      });

      await queryRunner.manager.save(nuevaCompraDoc);

      await queryRunner.commitTransaction();

      return { message: 'Compra creada exitosamente' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(searchTerm?: string) {
    const queryBuilder = this.compraRepository.createQueryBuilder('compra')
      .withDeleted()
      .leftJoinAndSelect('compra.proveedor', 'proveedor')
      .leftJoinAndSelect('compra.metodoPago', 'metodoPago')
      .leftJoinAndSelect('compra.documento', 'documento')
      .select([
        'compra.id as id',
        'compra.fecha as fecha',
        'compra.total as total',
        'compra.tipoCompra as tipo_compra',
        'metodoPago.nombre as metodo_pago',
        'proveedor.razonSocial as proveedor',
        'documento.numDocumento as num_documento',
      ])

    if (searchTerm) {
      queryBuilder.where(
        'UPPER(documento.numDocumento) LIKE UPPER(:search)',
        { search: `%${searchTerm}%` }
      )
    }

    const result = await queryBuilder.getRawMany();

    return result.map(r => {
      const { ID, FECHA, TOTAL, TIPO_COMPRA, METODO_PAGO, PROVEEDOR, NUM_DOCUMENTO } = r;

      return {
        id: ID,
        fecha: FECHA,
        total: TOTAL,
        tipoCompra: TIPO_COMPRA,
        metodoPago: METODO_PAGO,
        proveedor: PROVEEDOR,
        numDocumento: NUM_DOCUMENTO,
      }
    });
  }

  async findOne(id: number) {
    const compra = await this.compraRepository.createQueryBuilder('compra')
      .leftJoinAndSelect('compra.proveedor', 'proveedor')
      .leftJoinAndSelect('proveedor.direccion', 'direccion')
      .leftJoinAndSelect('direccion.municipio', 'municipio')
      .leftJoinAndSelect('municipio.departamento', 'departamento')
      .leftJoinAndSelect('compra.metodoPago', 'metodoPago')
      .leftJoinAndSelect('compra.documento', 'documento')
      .leftJoinAndSelect('compra.itemsCompra', 'itemsCompra')
      .leftJoinAndSelect('itemsCompra.vehiculo', 'vehiculo')
      .leftJoinAndSelect('vehiculo.linea', 'linea')
      .leftJoinAndSelect('linea.marca', 'marca')
      .leftJoinAndSelect('vehiculo.modelo', 'modelo')
      .leftJoinAndSelect('vehiculo.color', 'color')
      .leftJoinAndSelect('vehiculo.combustible', 'combustible')
      .leftJoinAndSelect('vehiculo.transmision', 'transmision')
      .leftJoinAndSelect('vehiculo.tipoVehiculo', 'tipoVehiculo')
      .leftJoinAndSelect('itemsCompra.unidadVehicular', 'unidadVehicular')
      .where('compra.id = :id', { id })
      .getOne();

    if (!compra) {
      throw new NotFoundException(`Compra con id ${id} no encontrada`);
    }

    const { id: compraId, fecha, total, subtotal, descuento, tipoCompra,
      documento, metodoPago, itemsCompra, proveedor, notas
    } = compra;
    const { fechaEmision, numDocumento, tipoDocumento, estado } = documento;
    const { id: proveedorId, razonSocial, nit, direccion: { calle, municipio: { nombre, departamento } } } = proveedor;

    const response = {
      id: compraId,
      fecha,
      total,
      subtotal,
      descuento,
      tipoCompra,
      notas,
      metodoPago: metodoPago?.nombre,
      documento: {
        fechaEmision,
        numDocumento,
        tipoDocumento,
        estado,
      },
      proveedor: {
        id: proveedorId,
        razonSocial,
        nit,
        direccion: {
          calle,
          municipio: nombre,
          departamento: departamento.nombre
        }
      },
      itemsCompra: itemsCompra.map(item => {
        const { costoFinal, costoUnitario, descuento, unidadVehicular, vehiculo } = item;
        const { vin } = unidadVehicular;
        const { color, combustible, transmision, tipoVehiculo, linea, modelo } = vehiculo;

        return {
          vehiculo: `${linea.marca.nombre} ${linea.nombre} ${modelo.nombre}`,
          color: color.nombre,
          combustible: combustible.nombre,
          transmision: transmision.nombre,
          tipoVehiculo: tipoVehiculo.nombre,
          vin,
          precioCompra: costoUnitario,
          precioFinal: costoFinal,
          descuento,
        }
      }),
    }

    return response;
  }

  async findByProveedor(id: number) {
    const result = await this.compraRepository.createQueryBuilder('compra')
      .leftJoinAndSelect('compra.documento', 'documento')
      .leftJoinAndSelect('compra.itemsCompra', 'itemsCompra')
      .where('compra.proveedor.id = :id', { id })
      .getMany();

    return result.map(r => {
      const { id, fecha, total, itemsCompra, documento: { numDocumento, estado } } = r;

      return {
        id,
        fecha,
        total,
        numDocumento,
        estado,
        numItems: itemsCompra.length,
      }
    });
  }

}
