import { Vehiculo } from "src/vehiculos/entities/vehiculo.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'PRECIOS_VENTA' })
export class PrecioVenta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'precio_base' })
  precioBase: number;

  @Column({ type: 'timestamp', name: 'vigente_desde' })
  vigenteDesde: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
  
  @ManyToOne(() => Vehiculo, vehiculo => vehiculo.preciosVenta)
  @JoinColumn({ name: 'vehiculo_id' })
  vehiculo: Vehiculo;
}
