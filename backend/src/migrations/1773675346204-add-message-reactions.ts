import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMessageReactions1773675346204 implements MigrationInterface {
    name = 'AddMessageReactions1773675346204'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create message_reactions table (other tables already created in init migration)
        await queryRunner.query(`CREATE TABLE "message_reactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "messageId" character varying NOT NULL, "userId" character varying NOT NULL, "emoji" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ddd819b0d57d406abdc573c6cdf" UNIQUE ("messageId", "userId", "emoji"), CONSTRAINT "PK_654a9f0059ff93a8f156be66a5b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "message_reactions"`);
    }

}
