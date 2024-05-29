module.exports = class Data1716973615625 {
    name = 'Data1716973615625'

    async up(db) {
        await db.query(`CREATE TABLE "reserve_repatriated" ("id" character varying NOT NULL, "amount" numeric NOT NULL, "user" text NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "market_id" character varying, CONSTRAINT "PK_f0b773c5a53a69baa6ce0d303bc" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_496c23b4457a6cc4269beb2bb2" ON "reserve_repatriated" ("user") `)
        await db.query(`CREATE INDEX "IDX_5044563f908c78050bc0e408a8" ON "reserve_repatriated" ("market_id") `)
        await db.query(`CREATE TABLE "user_balance" ("id" character varying NOT NULL, "user" text NOT NULL, "balance_change" integer NOT NULL, "market_id" character varying, CONSTRAINT "PK_f3edf5a1907e7b430421b9c2ddd" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_0f7286bb3c5c88d8b5a7612b11" ON "user_balance" ("user") `)
        await db.query(`CREATE INDEX "IDX_99b139cd3e9dadefb8263133d7" ON "user_balance" ("market_id") `)
        await db.query(`ALTER TABLE "reserve_repatriated" ADD CONSTRAINT "FK_5044563f908c78050bc0e408a8f" FOREIGN KEY ("market_id") REFERENCES "market"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "user_balance" ADD CONSTRAINT "FK_99b139cd3e9dadefb8263133d7c" FOREIGN KEY ("market_id") REFERENCES "market"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "reserve_repatriated"`)
        await db.query(`DROP INDEX "public"."IDX_496c23b4457a6cc4269beb2bb2"`)
        await db.query(`DROP INDEX "public"."IDX_5044563f908c78050bc0e408a8"`)
        await db.query(`DROP TABLE "user_balance"`)
        await db.query(`DROP INDEX "public"."IDX_0f7286bb3c5c88d8b5a7612b11"`)
        await db.query(`DROP INDEX "public"."IDX_99b139cd3e9dadefb8263133d7"`)
        await db.query(`ALTER TABLE "reserve_repatriated" DROP CONSTRAINT "FK_5044563f908c78050bc0e408a8f"`)
        await db.query(`ALTER TABLE "user_balance" DROP CONSTRAINT "FK_99b139cd3e9dadefb8263133d7c"`)
    }
}
