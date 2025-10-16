import { Persona } from "src/personas/entities/persona.entity";
import { Venta } from "src/ventas/entities/venta.entity";
import { DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'CLIENTES'})
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @OneToOne(() => Persona, persona => persona.cliente)
  @JoinColumn({ name: 'persona_id' })
  persona: Persona;

  @OneToMany(() => Venta, venta => venta.cliente)
  ventas: Venta[];
}
