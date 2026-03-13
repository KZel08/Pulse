import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSearchTrigger1773408254629 implements MigrationInterface {
    name = 'AddSearchTrigger1773408254629'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "messages_search_idx"`);

        // Create trigger function using $$ delimiter
        const createFunctionSQL = "CREATE FUNCTION messages_search_trigger() RETURNS trigger AS $$ BEGIN NEW.searchVector := to_tsvector('english', COALESCE(NEW.content, '')); RETURN NEW; END $$ LANGUAGE plpgsql";
        await queryRunner.query(createFunctionSQL);

        const createTriggerSQL = "CREATE TRIGGER messages_search_update BEFORE INSERT OR UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION messages_search_trigger()";
        await queryRunner.query(createTriggerSQL);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TRIGGER IF EXISTS messages_search_update ON messages`);
        await queryRunner.query(`DROP FUNCTION IF EXISTS messages_search_trigger`);
        await queryRunner.query(`CREATE INDEX "messages_search_idx" ON "messages" ("searchVector") `);
    }

}
