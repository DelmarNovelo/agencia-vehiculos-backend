import { TiposDocumento } from "src/common/enums/tipos-documento.enum";
import { Compra } from "src/compras/entities/compra.entity";
import { EstadoFactura } from "src/ventas/enums/estado-factura.enum";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'COMPRA_DOCS' })
export class CompraDoc {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, name: 'num_documento' })
  numDocumento: string;

  @Column({ type: 'varchar', length: 50, name: 'tipo_documento' })
  tipoDocumento: TiposDocumento;

  @Column({ type: 'date', name: 'fecha_emision' })
  fechaEmision: Date;

  @Column({ default: EstadoFactura.Pagada })
  estado: EstadoFactura;

  @OneToOne(() => Compra, compra => compra.documento)
  @JoinColumn({ name: 'compra_id' })
  compra: Compra;
}
