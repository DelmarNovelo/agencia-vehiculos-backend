import { ModuloPermiso } from "src/modulo-permisos/entities/modulo-permiso.entity";
import { Rol } from "src/roles/entities/rol.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'PERMISOS' })
export class Permiso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  nombre: string;

  @ManyToMany(() => Rol, rol => rol.permisos)
  @JoinColumn({ name: 'rol_id' })
  roles: Rol[];

  @ManyToOne(() => ModuloPermiso, moduloPermiso => moduloPermiso.permisos)
  @JoinColumn({ name: 'modulo_permiso_id' })
  moduloPermiso: ModuloPermiso;
}
