import { Persona } from "src/personas/entities/persona.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'EMPLEADOS' })
export class Empleado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', name: 'fecha_contratacion' })
  fechaContratacion: string;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @OneToOne(() => Persona, persona => persona.empleado)
  @JoinColumn({ name: 'persona_id' })
  persona: Persona;
}
