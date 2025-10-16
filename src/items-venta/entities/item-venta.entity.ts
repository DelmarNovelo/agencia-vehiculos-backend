import { UnidadVehicular } from "src/unidades-vehiculares/entities/unidad-vehicular.entity";
import { Venta } from "src/ventas/entities/venta.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'ITEMS_VENTA' })
export class ItemVenta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'precio_lista' })
  precioLista: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  descuento: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'precio_final' })
  precioFinal: number;

  @ManyToOne(() => Venta, venta => venta.ventaItems)
  @JoinColumn({ name: 'venta_id' })
  venta: Venta;

  @OneToOne(() => UnidadVehicular, unidadVehicular => unidadVehicular.itemVenta)
  @JoinColumn({ name: 'unidad_vehicular_id' })
  unidadVehicular: UnidadVehicular;
}
