import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLineaIndex1759598666128 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE UNIQUE INDEX IDX_LINEA_NOMBRE_MARCA
        ON LINEAS (nombre, marca_id)
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
