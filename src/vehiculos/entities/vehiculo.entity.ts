import { Color } from "src/colores/entities/color.entity";
import { Combustible } from "src/combustibles/entities/combustible.entity";
import { ItemCompra } from "src/items-compra/entities/item-compra.entity";
import { Linea } from "src/lineas/entities/linea.entity";
import { Modelo } from "src/modelos/entities/modelo.entity";
import { PrecioVenta } from "src/precios-venta/entities/precio-venta.entity";
import { TipoVehiculo } from "src/tipos-vehiculo/entities/tipo-vehiculo.entity";
import { Transmision } from "src/transmisiones/entities/transmision.entity";
import { UnidadVehicular } from "src/unidades-vehiculares/entities/unidad-vehicular.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'VEHICULOS' })
export class Vehiculo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar2', length: 1000, nullable: true })
  descripcion: string | null;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
  
  @ManyToOne(() => Color, color => color.vehiculos)
  @JoinColumn({ name: 'color_id' })
  color: Color;

  @ManyToOne(() => Combustible, combustible => combustible.vehiculos)
  @JoinColumn({ name: 'combustible_id' })
  combustible: Combustible;

  @ManyToOne(() => Transmision, transmision => transmision.vehiculos)
  @JoinColumn({ name: 'transmision_id' })
  transmision: Transmision;

  @ManyToOne(() => TipoVehiculo, tipoVehiculo => tipoVehiculo.vehiculos)
  @JoinColumn({ name: 'tipo_vehiculo_id' })
  tipoVehiculo: TipoVehiculo;

  @ManyToOne(() => Linea, linea => linea.vehiculos)
  @JoinColumn({ name: 'linea_id' })
  linea: Linea;

  @ManyToOne(() => Modelo, modelo => modelo.vehiculos)
  @JoinColumn({ name: 'modelo_id' })
  modelo: Modelo;

  @OneToMany(() => PrecioVenta, precioVenta => precioVenta.vehiculo, { cascade: true })
  preciosVenta: PrecioVenta[];

  @OneToMany(() => UnidadVehicular, unidadVehicular => unidadVehicular.vehiculo, { cascade: true })
  unidadesVehiculares: UnidadVehicular[];

  @OneToMany(() => ItemCompra, itemCompra => itemCompra.vehiculo)
  itemsCompra: ItemCompra[];
}
