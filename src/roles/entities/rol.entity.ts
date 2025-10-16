import { Permiso } from "src/permisos/entities/permiso.entity";
import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'ROLES' })
export class Rol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  nombre: string;

  @Column({ type: 'varchar2', length: 1000, nullable: true })
  descripcion: string | null;

  @Column({ default: true, name: 'can_be_deleted'})
  canBeDeleted: boolean;

  @ManyToMany(() => Permiso, permiso => permiso.roles)
  @JoinTable({
    name: 'rol_permiso',
    joinColumn: {
      name: 'rol_id', referencedColumnName: 'id'
    },
    inverseJoinColumn: { name: 'permiso_id', referencedColumnName: 'id' }
  })
  permisos: Permiso[];

  @ManyToMany(() => Usuario, usuario => usuario.roles)
  usuarios: Usuario[];
}
