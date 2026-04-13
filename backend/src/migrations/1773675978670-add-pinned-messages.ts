import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPinnedMessages1773675978670 implements MigrationInterface {
  name = 'AddPinnedMessages1773675978670';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "pinned_messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "messageId" character varying NOT NULL, "conversationId" character varying NOT NULL, "pinnedBy" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_7fa21cd035cc98de8a785e31e56" UNIQUE ("messageId"), CONSTRAINT "PK_f27ff551aca1df5eb7af6079b67" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "pinned_messages"`);
  }
}
