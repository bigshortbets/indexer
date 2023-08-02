module.exports = class Data1690971705584 {
    name = 'Data1690971705584'

    async up(db) {
        await db.query(`CREATE TABLE "market" ("id" character varying NOT NULL, "ticker" text, "tick_size" numeric, "lifetime" numeric, "initial_margin" numeric, "maintanance_margin" numeric, "contract_unit" numeric, CONSTRAINT "PK_1e9a2963edfd331d92018e3abac" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "order" ("id" character varying NOT NULL, "price" numeric NOT NULL, "quantity" numeric NOT NULL, "side" text, "who" text, "market_id" character varying, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_d91cc35ada00c918781b7f0599" ON "order" ("market_id") `)
        await db.query(`CREATE TABLE "position" ("id" character varying NOT NULL, "price" numeric NOT NULL, "quantity" numeric NOT NULL, "long" text, "short" text, "market_id" character varying, CONSTRAINT "PK_b7f483581562b4dc62ae1a5b7e2" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_d744886149158961e1b796182f" ON "position" ("market_id") `)
        await db.query(`CREATE TABLE "oracle_price" ("id" character varying NOT NULL, "price" numeric NOT NULL, "block_height" numeric NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "market_id" character varying, CONSTRAINT "PK_606c938b2474588b154eb625f3b" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_cc82e080fa755d5fce72a8c204" ON "oracle_price" ("market_id") `)
        await db.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_d91cc35ada00c918781b7f0599d" FOREIGN KEY ("market_id") REFERENCES "market"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "position" ADD CONSTRAINT "FK_d744886149158961e1b796182f8" FOREIGN KEY ("market_id") REFERENCES "market"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "oracle_price" ADD CONSTRAINT "FK_cc82e080fa755d5fce72a8c204a" FOREIGN KEY ("market_id") REFERENCES "market"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "market"`)
        await db.query(`DROP TABLE "order"`)
        await db.query(`DROP INDEX "public"."IDX_d91cc35ada00c918781b7f0599"`)
        await db.query(`DROP TABLE "position"`)
        await db.query(`DROP INDEX "public"."IDX_d744886149158961e1b796182f"`)
        await db.query(`DROP TABLE "oracle_price"`)
        await db.query(`DROP INDEX "public"."IDX_cc82e080fa755d5fce72a8c204"`)
        await db.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_d91cc35ada00c918781b7f0599d"`)
        await db.query(`ALTER TABLE "position" DROP CONSTRAINT "FK_d744886149158961e1b796182f8"`)
        await db.query(`ALTER TABLE "oracle_price" DROP CONSTRAINT "FK_cc82e080fa755d5fce72a8c204a"`)
    }
}