import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSearchIndex1773406899073 implements MigrationInterface {
  name = 'AddSearchIndex1773406899073';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "messages" ADD "searchVector" tsvector`,
    );
    await queryRunner.query(
      `CREATE INDEX messages_search_idx ON "messages" USING GIN("searchVector")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS messages_search_idx`);
    await queryRunner.query(
      `ALTER TABLE "messages" DROP COLUMN "searchVector"`,
    );
  }
}
