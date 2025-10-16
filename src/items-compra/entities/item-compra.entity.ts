import { Compra } from "src/compras/entities/compra.entity";
import { UnidadVehicular } from "src/unidades-vehiculares/entities/unidad-vehicular.entity";
import { Vehiculo } from "src/vehiculos/entities/vehiculo.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'ITEMS_COMPRA' })
export class ItemCompra {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'costo_unitario' })
  costoUnitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  descuento: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'costo_final' })
  costoFinal: number;

  @ManyToOne(() => Compra, compra => compra.itemsCompra)
  @JoinColumn({ name: 'compra_id' })
  compra: Compra;

  @ManyToOne(() => Vehiculo, vehiculo => vehiculo.itemsCompra)
  @JoinColumn({ name: 'vehiculo_id' })
  vehiculo: Vehiculo;

  @OneToOne(() => UnidadVehicular, unidadVehicular => unidadVehicular.itemCompra)
  @JoinColumn({ name: 'unidad_vehicular_id' })
  unidadVehicular: UnidadVehicular;
}
