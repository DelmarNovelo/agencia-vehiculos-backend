import { Persona } from "src/personas/entities/persona.entity";
import { Rol } from "src/roles/entities/rol.entity";
import { Venta } from "src/ventas/entities/venta.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'USUARIOS' })
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  email: string;

  @Column({ length: 150 })
  password: string;

  @Column({ default: true, name: 'can_be_deleted' })
  canBeDeleted: boolean;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true }) 
  deletedAt: Date | null;

  @OneToOne(() => Persona, persona => persona.usuario, { cascade: true })
  @JoinColumn({ name: 'persona_id' })
  persona: Persona;

  @OneToOne(() => Venta, venta => venta.usuario)
  ventas: Venta;

  @ManyToMany(() => Rol, rol => rol.usuarios)
  @JoinTable({
    name: 'usuario_rol',
    joinColumn: {
      name: 'usuario_id', referencedColumnName: 'id'
    },
    inverseJoinColumn: { name: 'rol_id', referencedColumnName: 'id' }
  })
  roles: Rol[];
}
