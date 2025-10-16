import { Factura } from "src/facturas/entities/factura.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'FEL_DOCS' })
export class FelDoc {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  serie: string;

  @Column({ length: 50, name: 'numero_dte' })
  numeroDTE: string;

  @Column({ length: 50, name: 'numero_aut' })
  numeroAut: string;

  @Column({ type: 'timestamp', name: 'fecha_certificacion' })
  fechaCertificacion: Date;

  @OneToOne(() => Factura, factura => factura.felDoc)
  @JoinColumn({ name: 'factura_id' })
  factura: Factura;
}

