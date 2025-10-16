import { FelDoc } from "src/fel-docs/entities/fel-doc.entity";
import { Venta } from "src/ventas/entities/venta.entity";
import { EstadoFactura } from "src/ventas/enums/estado-factura.enum";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'FACTURAS' })
export class Factura {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', name: 'fecha_emision' })
  fechaEmision: Date;

  @Column()
  estado: EstadoFactura;

  @OneToOne(() => FelDoc, felDoc => felDoc.factura)
  felDoc: FelDoc;

  @OneToOne(() => Venta, venta => venta.factura)
  @JoinColumn({ name: 'venta_id' })
  venta: Venta;
}
