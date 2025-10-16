import { Empresa } from "src/empresas/entities/empresa.entity";
import { Municipio } from "src/municipios/entities/municipio.entity";
import { Persona } from "src/personas/entities/persona.entity";
import { Proveedor } from "src/proveedores/entities/proveedor.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'DIRECCIONES' })
export class Direccion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 250 })
  calle: string;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Municipio, municipio => municipio.direcciones)
  @JoinColumn({ name: 'municipio_id' })
  municipio: Municipio;

  @OneToOne(() => Persona, persona => persona.direccion)
  @JoinColumn({ name: 'persona_id' })
  persona: Persona;

  @OneToOne(() => Proveedor, proveedor => proveedor.direccion)
  @JoinColumn({ name: 'proveedor_id' })
  proveedor: Proveedor;

  @OneToOne(() => Empresa, empresa => empresa.direccion)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;
}
