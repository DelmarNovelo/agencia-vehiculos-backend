import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { DataSource, Repository } from 'typeorm';
import { Marca } from 'src/marcas/entities/marca.entity';
import { UnidadVehicular } from 'src/unidades-vehiculares/entities/unidad-vehicular.entity';
import { PrecioVenta } from 'src/precios-venta/entities/precio-venta.entity';
import { Vehiculo } from './entities/vehiculo.entity';
import { Linea } from 'src/lineas/entities/linea.entity';
import { Modelo } from 'src/modelos/entities/modelo.entity';
import { Color } from 'src/colores/entities/color.entity';
import { Combustible } from 'src/combustibles/entities/combustible.entity';
import { Transmision } from 'src/transmisiones/entities/transmision.entity';
import { TipoVehiculo } from 'src/tipos-vehiculo/entities/tipo-vehiculo.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class VehiculosService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,
  ) { }

  async create(createVehiculoDto: CreateVehiculoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { marcaId, lineaId, modeloId, colorId, combustibleId, transmisionId,
        tipoVehiculoId, descripcion, unidades, precioVenta } = createVehiculoDto;

      const marca = await queryRunner.manager.findOneBy(Marca, { id: marcaId });
      if (!marca) {
        throw new NotFoundException('La marca seleccionada no fue encontrada, puede que haya sido eliminada');
      }

      const linea = await queryRunner.manager.findOneBy(Linea, { id: lineaId });
      if (!linea) {
        throw new NotFoundException('La linea seleccionada no fue encontrada, puede que haya sido eliminada');
      }

      const modelo = await queryRunner.manager.findOneBy(Modelo, { id: modeloId });
      if (!modelo) {
        throw new NotFoundException('El modelo seleccionado no fue encontrado, puede que haya sido eliminado');
      }

      const color = await queryRunner.manager.findOneBy(Color, { id: colorId });
      if (!color) {
        throw new NotFoundException('El color seleccionado no fue encontrado, puede que haya sido eliminado');
      }

      const combustible = await queryRunner.manager.findOneBy(Combustible, { id: combustibleId });
      if (!combustible) {
        throw new NotFoundException('El combustible seleccionado no fue encontrado, puede que haya sido eliminado');
      }

      const transmision = await queryRunner.manager.findOneBy(Transmision, { id: transmisionId });
      if (!transmision) {
        throw new NotFoundException('La transmision seleccionada no fue encontrada, puede que haya sido eliminada');
      }

      const tipoVehiculo = await queryRunner.manager.findOneBy(TipoVehiculo, { id: tipoVehiculoId });
      if (!tipoVehiculo) {
        throw new NotFoundException('El tipo de vehiculo seleccionado no fue encontrado, puede que haya sido eliminado');
      }

      const vehiculo = queryRunner.manager.create(Vehiculo, {
        color,
        combustible,
        transmision,
        tipoVehiculo,
        linea,
        modelo,
        descripcion,
      });

      const vehiculoGuardado = await queryRunner.manager.save(vehiculo);

      const unidadesVehiculares = unidades.map(u => {
        return queryRunner.manager.create(UnidadVehicular, {
          vin: u.vin,
          vehiculo: vehiculoGuardado,
        });
      });

      await queryRunner.manager.save(unidadesVehiculares);

      const precioVentaEntity = queryRunner.manager.create(PrecioVenta, {
        precioBase: precioVenta,
        vehiculo: vehiculoGuardado,
        vigenteDesde: new Date(),
      });

      await queryRunner.manager.save(precioVentaEntity);

      await queryRunner.commitTransaction();

      return { id: vehiculoGuardado.id, message: 'Vehículo creado exitosamente' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(searchTerm?: string) {
    const queryBuilder = this.dataSource.manager.createQueryBuilder(Vehiculo, 'vehiculo')
      .withDeleted()
      .leftJoinAndSelect('vehiculo.color', 'color')
      .leftJoinAndSelect('vehiculo.combustible', 'combustible')
      .leftJoinAndSelect('vehiculo.transmision', 'transmision')
      .leftJoinAndSelect('vehiculo.tipoVehiculo', 'tipoVehiculo')
      .leftJoinAndSelect('vehiculo.linea', 'linea')
      .leftJoinAndSelect('vehiculo.modelo', 'modelo')
      .leftJoinAndSelect('linea.marca', 'marca')
      .where('vehiculo.deletedAt IS NULL');

    if (searchTerm) {
      queryBuilder.andWhere(
        '(CONCAT(CONCAT(UPPER(marca.nombre), \' \'), UPPER(linea.nombre)) LIKE UPPER(:search) OR ' +
        '(UPPER(marca.nombre) LIKE UPPER(:search) OR ' +
        'UPPER(linea.nombre) LIKE UPPER(:search) OR ' +
        'UPPER(modelo.nombre) LIKE UPPER(:search)))',
        { search: `%${searchTerm}%` }
      );
    }

    const result = await queryBuilder
      .select([
        'vehiculo.id AS id',
        'color.nombre AS color',
        'combustible.nombre AS combustible',
        'transmision.nombre AS transmision',
        'tipoVehiculo.nombre AS tipoVehiculo',
        'linea.nombre AS linea',
        'modelo.nombre AS modelo',
        'marca.nombre AS marca',
      ])
      .getRawMany();

    return result.map(v => ({
      id: v.ID,
      color: v.COLOR,
      combustible: v.COMBUSTIBLE,
      transmision: v.TRANSMISION,
      tipoVehiculo: v.TIPOVEHICULO,
      linea: v.LINEA,
      modelo: v.MODELO,
      marca: v.MARCA,
    }));
  }

  async findAllForAutocomplete(searchTerm?: string) {
    const queryBuilder = this.dataSource.manager.createQueryBuilder(Vehiculo, 'vehiculo')
      .withDeleted()
      .leftJoinAndSelect('vehiculo.color', 'color')
      .leftJoinAndSelect('vehiculo.combustible', 'combustible')
      .leftJoinAndSelect('vehiculo.transmision', 'transmision')
      .leftJoinAndSelect('vehiculo.tipoVehiculo', 'tipoVehiculo')
      .leftJoinAndSelect('vehiculo.linea', 'linea')
      .leftJoinAndSelect('vehiculo.modelo', 'modelo')
      .leftJoinAndSelect('linea.marca', 'marca')
      .leftJoin('vehiculo.preciosVenta', 'pv', 'pv.deletedAt IS NULL AND pv.vigenteDesde <= SYSDATE')

    if (searchTerm) {
      queryBuilder.andWhere(
        '(CONCAT(CONCAT(UPPER(marca.nombre), \' \'), UPPER(linea.nombre)) LIKE UPPER(:search) OR ' +
        '(UPPER(marca.nombre) LIKE UPPER(:search) OR ' +
        'UPPER(linea.nombre) LIKE UPPER(:search) OR ' +
        'UPPER(modelo.nombre) LIKE UPPER(:search)))',
        { search: `%${searchTerm}%` }
      );
    }

    const result = await queryBuilder
      .select([
        'vehiculo.id AS id',
        'vehiculo.descripcion AS descripcion',
        'color.nombre AS color',
        'combustible.nombre AS combustible',
        'transmision.nombre AS transmision',
        'tipoVehiculo.nombre AS tipoVehiculo',
        'linea.nombre AS linea',
        'modelo.nombre AS modelo',
        'marca.nombre AS marca',
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
        ) AS precioVenta`,
      ])
      .orderBy('marca.nombre', 'ASC')
      .addOrderBy('linea.nombre', 'ASC')
      .addOrderBy('modelo.nombre', 'ASC')
      .getRawMany();

    return result.map(v => ({
      id: v.ID,
      label: `${v.MARCA} ${v.LINEA} ${v.MODELO}`,
      descripcion: v.DESCRIPCION,
      color: v.COLOR,
      combustible: v.COMBUSTIBLE,
      transmision: v.TRANSMISION,
      tipoVehiculo: v.TIPOVEHICULO,
      precioVenta: v.PRECIOVENTA,
    }));
  }

  async findOneForDetail(id: number) {
    const result = await this.dataSource.manager.createQueryBuilder(Vehiculo, 'vehiculo')
      .withDeleted()
      .where('vehiculo.id = :id', { id })
      .leftJoinAndSelect('vehiculo.color', 'color')
      .leftJoinAndSelect('vehiculo.combustible', 'combustible')
      .leftJoinAndSelect('vehiculo.transmision', 'transmision')
      .leftJoinAndSelect('vehiculo.tipoVehiculo', 'tipoVehiculo')
      .leftJoinAndSelect('vehiculo.linea', 'linea')
      .leftJoinAndSelect('vehiculo.modelo', 'modelo')
      .leftJoinAndSelect('linea.marca', 'marca')
      .select([
        'vehiculo.id AS id',
        'vehiculo.descripcion AS descripcion',
        'color.nombre AS color',
        'combustible.nombre AS combustible',
        'transmision.nombre AS transmision',
        'tipoVehiculo.nombre AS tipoVehiculo',
        'linea.nombre AS linea',
        'modelo.nombre AS modelo',
        'marca.nombre AS marca',
        // ID del precio vigente
        `(SELECT pv.id
          FROM PRECIOS_VENTA pv
          WHERE pv.vehiculo_id = "vehiculo"."ID"
            AND pv.vigente_desde <= SYSDATE
            AND pv.vigente_desde = (
              SELECT MAX(pv2.vigente_desde)
              FROM PRECIOS_VENTA pv2
              WHERE pv2.vehiculo_id = "vehiculo"."ID"
                AND pv2.vigente_desde <= SYSDATE
            )
        ) AS precioVentaId`,
        // 👇 Subquery para traer precio vigente (fecha <= SYSDATE)
        `(SELECT pv.precio_base
          FROM PRECIOS_VENTA pv
          WHERE pv.vehiculo_id = "vehiculo"."ID"
            AND pv.vigente_desde <= SYSDATE
            AND pv.vigente_desde = (
              SELECT MAX(pv2.vigente_desde)
              FROM PRECIOS_VENTA pv2
              WHERE pv2.vehiculo_id = "vehiculo"."ID"
                AND pv2.vigente_desde <= SYSDATE
            )
          ) AS precioVenta`,
      ])
      .getRawOne();

    const { ID, DESCRIPCION, COLOR, COMBUSTIBLE, TRANSMISION, TIPOVEHICULO, LINEA, MODELO, MARCA, PRECIOVENTA, PRECIOVENTAID } = result;

    return {
      id: ID,
      descripcion: DESCRIPCION,
      color: COLOR,
      combustible: COMBUSTIBLE,
      transmision: TRANSMISION,
      tipoVehiculo: TIPOVEHICULO,
      linea: LINEA,
      modelo: MODELO,
      marca: MARCA,
      precioVenta: PRECIOVENTA,
      precioVentaId: PRECIOVENTAID,
    };
  }

  async findOne(id: number) {
    const result = await this.dataSource.manager.createQueryBuilder(Vehiculo, 'vehiculo')
      .where('vehiculo.id = :id', { id })
      .leftJoinAndSelect('vehiculo.color', 'color')
      .leftJoinAndSelect('vehiculo.combustible', 'combustible')
      .leftJoinAndSelect('vehiculo.transmision', 'transmision')
      .leftJoinAndSelect('vehiculo.tipoVehiculo', 'tipoVehiculo')
      .leftJoinAndSelect('vehiculo.linea', 'linea')
      .leftJoinAndSelect('vehiculo.modelo', 'modelo')
      .leftJoinAndSelect('linea.marca', 'marca')
      .select([
        'vehiculo.id AS id',
        'vehiculo.descripcion AS descripcion',
        'color.id AS colorId',
        'combustible.id AS combustibleId',
        'transmision.id AS transmisionId',
        'tipoVehiculo.id AS tipoVehiculoId',
        'linea.id AS lineaId',
        'modelo.id AS modeloId',
        'marca.id AS marcaId',
      ])
      .getRawOne();

    const { ID, DESCRIPCION, COLORID, COMBUSTIBLEID, TRANSMISIONID, TIPOVEHICULOID, LINEAID, MODELOID, MARCAID } = result;

    return {
      id: ID,
      descripcion: DESCRIPCION,
      colorId: COLORID,
      combustibleId: COMBUSTIBLEID,
      transmisionId: TRANSMISIONID,
      tipoVehiculoId: TIPOVEHICULOID,
      lineaId: LINEAID,
      modeloId: MODELOID,
      marcaId: MARCAID,
    };
  }

  async update(id: number, updateVehiculoDto: UpdateVehiculoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { marcaId, lineaId, modeloId, colorId, combustibleId, transmisionId,
        tipoVehiculoId, descripcion } = updateVehiculoDto;

      const vehiculo = await queryRunner.manager.findOneBy(Vehiculo, { id });

      if (!vehiculo) {
        throw new NotFoundException('El vehículo seleccionado no fue encontrado, puede que haya sido eliminado');
      }

      const marca = await queryRunner.manager.findOneBy(Marca, { id: marcaId });
      if (!marca) {
        throw new NotFoundException('La marca seleccionada no fue encontrada, puede que haya sido eliminada');
      }

      const linea = await queryRunner.manager.findOneBy(Linea, { id: lineaId });
      if (!linea) {
        throw new NotFoundException('La linea seleccionada no fue encontrada, puede que haya sido eliminada');
      }

      const modelo = await queryRunner.manager.findOneBy(Modelo, { id: modeloId });
      if (!modelo) {
        throw new NotFoundException('El modelo seleccionado no fue encontrado, puede que haya sido eliminado');
      }

      const color = await queryRunner.manager.findOneBy(Color, { id: colorId });
      if (!color) {
        throw new NotFoundException('El color seleccionado no fue encontrado, puede que haya sido eliminado');
      }

      const combustible = await queryRunner.manager.findOneBy(Combustible, { id: combustibleId });
      if (!combustible) {
        throw new NotFoundException('El combustible seleccionado no fue encontrado, puede que haya sido eliminado');
      }

      const transmision = await queryRunner.manager.findOneBy(Transmision, { id: transmisionId });
      if (!transmision) {
        throw new NotFoundException('La transmision seleccionada no fue encontrada, puede que haya sido eliminada');
      }

      const tipoVehiculo = await queryRunner.manager.findOneBy(TipoVehiculo, { id: tipoVehiculoId });
      if (!tipoVehiculo) {
        throw new NotFoundException('El tipo de vehiculo seleccionado no fue encontrado, puede que haya sido eliminado');
      }

      vehiculo.color = color;
      vehiculo.combustible = combustible;
      vehiculo.transmision = transmision;
      vehiculo.tipoVehiculo = tipoVehiculo;
      vehiculo.linea = linea;
      vehiculo.modelo = modelo;
      vehiculo.descripcion = descripcion;

      await queryRunner.manager.save(vehiculo);

      await queryRunner.commitTransaction();

      return { message: 'Vehículo actualizado exitosamente' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verificar que el vehículo existe
      const vehiculo = await queryRunner.manager.findOneBy(Vehiculo, { id });
      if (!vehiculo) {
        throw new NotFoundException('El vehículo seleccionado no fue encontrado, puede que haya sido eliminado');
      }

      // Soft delete del vehículo
      await queryRunner.manager.softDelete(Vehiculo, id);

      // Soft delete de todos los precios de venta asociados
      await queryRunner.manager.softDelete(PrecioVenta, {
        vehiculo: { id }
      });

      // Soft delete de todas las unidades vehiculares asociadas
      await queryRunner.manager.softDelete(UnidadVehicular, {
        vehiculo: { id }
      });

      await queryRunner.commitTransaction();

      return { message: 'Vehículo eliminado exitosamente' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
