import { Persona } from "src/personas/entities/persona.entity";
import { Proveedor } from "src/proveedores/entities/proveedor.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'CONTACTOS_PROVEEDOR' })
export class ContactoProveedor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 25 })
  cargo: string;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @OneToOne(() => Persona, persona => persona.contactoProveedor)
  @JoinColumn({ name: 'persona_id' })
  persona: Persona;

  @ManyToOne(() => Proveedor, proveedor => proveedor.contactosProveedor)
  @JoinColumn({ name: 'proveedor_id' })
  proveedor: Proveedor;
}
