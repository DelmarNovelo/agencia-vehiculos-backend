import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateVentaDto } from './dto/create-venta.dto';
import { Venta } from './entities/venta.entity';
import { ItemVenta } from 'src/items-venta/entities/item-venta.entity';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { UnidadVehicular } from 'src/unidades-vehiculares/entities/unidad-vehicular.entity';
import { MetodoPago } from 'src/metodos-pago/entities/metodo-pago.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Factura } from 'src/facturas/entities/factura.entity';
import { EstadoFactura } from './enums/estado-factura.enum';
import { FelDoc } from 'src/fel-docs/entities/fel-doc.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class VentasService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) { }

  async create(createVentaDto: CreateVentaDto, usuarioId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { clienteId, metodoPagoId, tipoVenta, notas, items } = createVentaDto;

      const cliente = await queryRunner.manager.findOneBy(Cliente, { id: clienteId });

      if (!cliente) {
        throw new NotFoundException('Cliente no encontrado');
      }

      const metodoPago = await queryRunner.manager.findOneBy(MetodoPago, { id: metodoPagoId });

      if (!metodoPago) {
        throw new NotFoundException('Metodo de pago no encontrado');
      }

      const usuario = await queryRunner.manager.findOne(Usuario, {
        where: { id: usuarioId }
      });

      const unidadesVehiculares: any[] = [];
      for (const item of items) {
        const unidadVehicular = await queryRunner.manager
          .createQueryBuilder(UnidadVehicular, 'uv')
          .leftJoinAndSelect('uv.vehiculo', 'vehiculo')
          .where('uv.id = :id', { id: item.unidadId })
          .andWhere('uv.disponible = :disponible', { disponible: true })
          .andWhere('vehiculo.id = :vId', { vId: item.vehiculoId })
          .select([
            `(SELECT precio_base
              FROM (
                SELECT 
                  pv.PRECIO_BASE,
                  ROW_NUMBER() OVER (
                    PARTITION BY pv.VEHICULO_ID 
                    ORDER BY pv.VIGENTE_DESDE DESC, pv.ID DESC
                  ) as rn
                FROM PRECIOS_VENTA pv
                WHERE pv.DELETED_AT IS NULL
                  AND pv.VIGENTE_DESDE <= SYSDATE
                  AND pv.VEHICULO_ID = "vehiculo"."ID"
              )
              WHERE rn = 1
            ) AS precio_venta`,
            'uv.id as id',
            'uv.vin as vin',
            'vehiculo.id as vehiculo_id',
          ])
          .getRawOne();

        if (!unidadVehicular) {
          throw new NotFoundException(`Unidad vehicular con VIN ${item.vin} no disponible para venta`);
        }

        unidadesVehiculares.push(unidadVehicular);
      }

      const subtotal = unidadesVehiculares.reduce((acc, uv) => uv.PRECIO_VENTA + acc, 0);
      const descuento = items.reduce((acc, item) => item.descuento + acc, 0);

      const venta = queryRunner.manager.create(Venta, {
        fecha: new Date(),
        subtotal,
        descuento,
        total: subtotal - descuento,
        notas,
        tipoVenta,
        usuario: usuario!,
        cliente,
        metodoPago,
      });

      const ventaGuardada = await queryRunner.manager.save(venta);

      const factura = queryRunner.manager.create(Factura, {
        fechaEmision: new Date(),
        estado: EstadoFactura.Pagada,
        venta: ventaGuardada,
      });
      await queryRunner.manager.save(factura);

      const numAut = uuidv4().toUpperCase();
      const numDTE = Math.floor(Math.random() * 100000000);

      const felDoc = queryRunner.manager.create(FelDoc, {
        serie: numAut.split('-')[0],
        numeroDTE: numDTE.toString(),
        numeroAut: numAut,
        fechaCertificacion: new Date(),
        factura: factura,
      });
      await queryRunner.manager.save(felDoc);

      // Crear items de venta
      const itemsVenta = items.map((item, index) => {
        const unidadVehicular = unidadesVehiculares.find(uv => uv.VIN === item.vin);

        return queryRunner.manager.create(ItemVenta, {
          precioLista: unidadVehicular.PRECIO_VENTA,
          descuento: item.descuento,
          precioFinal: unidadVehicular.PRECIO_VENTA - item.descuento,
          venta: ventaGuardada,
          unidadVehicular: { id: unidadVehicular.ID },
        });
      });

      await queryRunner.manager.save(itemsVenta);

      // Marcar unidades vehiculares como no disponibles
      for (const item of items) {
        await queryRunner.manager.update(UnidadVehicular, item.unidadId, { disponible: false });
      }

      await queryRunner.commitTransaction();

      return {
        ventaId: ventaGuardada.id,
        message: 'Venta creada exitosamente',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(searchTerm?: string) {
    const queryBuilder = this.ventaRepository.createQueryBuilder('venta')
      .leftJoinAndSelect('venta.cliente', 'cliente')
      .leftJoinAndSelect('cliente.persona', 'persona')
      .leftJoinAndSelect('venta.metodoPago', 'metodoPago')
      .leftJoinAndSelect('venta.factura', 'factura')
      .leftJoinAndSelect('factura.felDoc', 'felDoc')
      .select([
        'venta.id as id',
        'venta.fecha as fecha',
        'venta.total as total',
        'venta.tipoVenta as tipo_venta',
        'metodoPago.nombre as metodo_pago',
        'persona.nombre as nombre',
        'persona.apellido as apellido',
        'felDoc.numeroDTE as numero_dte',
      ])
      .orderBy('venta.fecha', 'DESC')

    if (searchTerm) {
      queryBuilder.where(
        'UPPER(felDoc.numeroDTE) LIKE UPPER(:search)',
        { search: `%${searchTerm}%` }
      )
    }

    const result = await queryBuilder.getRawMany();


    return result.map(venta => {
      return {
        id: venta.ID,
        fecha: venta.FECHA,
        total: venta.TOTAL,
        tipoVenta: venta.TIPO_VENTA,
        metodoPago: venta.METODO_PAGO,
        nombreCliente: `${venta.NOMBRE} ${venta.APELLIDO}`,
        numeroDte: venta.NUMERO_DTE,
      }
    });
  }

  async findOne(id: number) {
    const venta = await this.ventaRepository.createQueryBuilder('venta')
      .leftJoinAndSelect('venta.cliente', 'cliente')
      .leftJoinAndSelect('cliente.persona', 'persona')
      .leftJoinAndSelect('persona.direccion', 'direccion')
      .leftJoinAndSelect('direccion.municipio', 'municipio')
      .leftJoinAndSelect('municipio.departamento', 'departamento')
      .leftJoinAndSelect('persona.contactos', 'contactos')
      .leftJoinAndSelect('venta.metodoPago', 'metodoPago')
      .leftJoinAndSelect('venta.factura', 'factura')
      .leftJoinAndSelect('factura.felDoc', 'felDoc')
      .leftJoinAndSelect('venta.ventaItems', 'ventaItems')
      .leftJoinAndSelect('ventaItems.unidadVehicular', 'unidadVehicular')
      .leftJoinAndSelect('unidadVehicular.vehiculo', 'vehiculo')
      .leftJoinAndSelect('vehiculo.linea', 'linea')
      .leftJoinAndSelect('linea.marca', 'marca')
      .leftJoinAndSelect('vehiculo.modelo', 'modelo')
      .leftJoinAndSelect('vehiculo.color', 'color')
      .leftJoinAndSelect('vehiculo.combustible', 'combustible')
      .leftJoinAndSelect('vehiculo.transmision', 'transmision')
      .leftJoinAndSelect('vehiculo.tipoVehiculo', 'tipoVehiculo')
      .where('venta.id = :id', { id })
      .getOne();

    if (!venta) {
      throw new NotFoundException(`Venta con id ${id} no encontrada`);
    }

    return venta;
  }

  async findByCliente(clienteId: number) {
    const result = await this.ventaRepository.createQueryBuilder('venta')
      .withDeleted()
      .leftJoinAndSelect('venta.cliente', 'cliente')
      .leftJoinAndSelect('venta.factura', 'factura')
      .leftJoinAndSelect('venta.metodoPago', 'metodoPago')
      .leftJoinAndSelect('venta.ventaItems', 'ventaItems')
      .leftJoinAndSelect('ventaItems.unidadVehicular', 'uv')
      .leftJoinAndSelect('uv.vehiculo', 'vehiculo')
      .leftJoinAndSelect('vehiculo.linea', 'linea')
      .leftJoinAndSelect('linea.marca', 'marca')
      .leftJoinAndSelect('vehiculo.modelo', 'modelo')
      .where('venta.cliente.id = :clienteId', { clienteId })
      .orderBy('venta.fecha', 'DESC')
      .select([
        'venta.id as id',
        'marca.nombre as marca',
        'modelo.nombre as modelo',
        'linea.nombre as linea',
        'uv.vin as vin',
        'ventaItems.precioFinal as precio_final',
        'venta.fecha as fecha',
        'factura.estado as estado_factura',
      ])
      .getRawMany();

    const vehiculos = result.map(venta => {
      const { ID, MARCA, MODELO, LINEA, VIN, PRECIO_FINAL, FECHA, ESTADO_FACTURA } = venta;

      return {
        id: ID,
        vehiculo: `${MARCA} ${MODELO} ${LINEA}`,
        vin: VIN,
        precioFinal: PRECIO_FINAL,
        fecha: FECHA,
        estadoFactura: ESTADO_FACTURA,
      }
    });

    const totalCompras = vehiculos.reduce((acc, vehiculo) => acc + vehiculo.precioFinal, 0);

    return {
      vehiculos,
      totalCompras,
    };
  }

}
