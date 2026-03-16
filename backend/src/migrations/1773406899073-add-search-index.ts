import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSearchIndex1773406899073 implements MigrationInterface {
  name = 'AddSearchIndex1773406899073';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Column already exists in the table (created in init migration)
    // Just create the GIN index for full-text search
    await queryRunner.query(
      `CREATE INDEX messages_search_idx ON "messages" USING GIN("searchVector")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS messages_search_idx`);
  }
}
