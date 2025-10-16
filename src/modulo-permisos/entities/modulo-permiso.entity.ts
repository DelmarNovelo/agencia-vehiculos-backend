import { Permiso } from "src/permisos/entities/permiso.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('MODULO_PERMISOS')
export class ModuloPermiso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @OneToMany((() => Permiso), permiso => permiso.moduloPermiso)
  permisos: Permiso[];
}
