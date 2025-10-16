import { ItemCompra } from "src/items-compra/entities/item-compra.entity";
import { ItemVenta } from "src/items-venta/entities/item-venta.entity";
import { Vehiculo } from "src/vehiculos/entities/vehiculo.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'UNIDADES_VEHICULARES' })
export class UnidadVehicular {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  vin: string;

  @Column({ default: true })
  disponible: boolean;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Vehiculo, vehiculo => vehiculo.unidadesVehiculares)
  @JoinColumn({ name: 'vehiculo_id' })
  vehiculo: Vehiculo;

  @OneToOne(() => ItemVenta, itemVenta => itemVenta.unidadVehicular)
  itemVenta: ItemVenta;

  @OneToOne(() => ItemCompra, itemCompra => itemCompra.unidadVehicular)
  itemCompra: ItemCompra;
}
