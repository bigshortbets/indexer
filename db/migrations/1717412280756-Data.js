module.exports = class Data1717412280756 {
    name = 'Data1717412280756'

    async up(db) {
        await db.query(`CREATE TABLE "market" ("id" character varying NOT NULL, "ticker" text NOT NULL, "tick_size" numeric NOT NULL, "lifetime" numeric NOT NULL, "initial_margin" integer NOT NULL, "maintenance_margin" integer NOT NULL, "contract_unit" numeric NOT NULL, "block_height" numeric NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "daily_volume" numeric NOT NULL, "oracle_price" numeric, "status" character varying(5) NOT NULL, CONSTRAINT "PK_1e9a2963edfd331d92018e3abac" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "order" ("id" character varying NOT NULL, "price" numeric NOT NULL, "quantity" numeric NOT NULL, "side" character varying(5) NOT NULL, "who" text, "block_height" numeric NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "initial_quantity" numeric NOT NULL, "status" character varying(23) NOT NULL, "type" character varying(7) NOT NULL, "market_id" character varying, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_d91cc35ada00c918781b7f0599" ON "order" ("market_id") `)
        await db.query(`CREATE TABLE "position" ("id" character varying NOT NULL, "create_price" numeric NOT NULL, "price" numeric NOT NULL, "quantity" numeric NOT NULL, "quantity_left" numeric NOT NULL, "long" text NOT NULL, "short" text NOT NULL, "block_height" numeric NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "status" character varying(6), "market_id" character varying, CONSTRAINT "PK_b7f483581562b4dc62ae1a5b7e2" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_d744886149158961e1b796182f" ON "position" ("market_id") `)
        await db.query(`CREATE TABLE "aggregated_orders_by_price" ("id" character varying NOT NULL, "price" numeric NOT NULL, "quantity" numeric NOT NULL, "side" character varying(5) NOT NULL, "market_id" character varying, CONSTRAINT "PK_43d8c277d4b42f0ecd9e93d1d76" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_6a3c7cf051dee6be40f560f2f0" ON "aggregated_orders_by_price" ("market_id") `)
        await db.query(`CREATE TABLE "withdraw" ("id" character varying NOT NULL, "amount" numeric NOT NULL, "user" text NOT NULL, "status" character varying(9) NOT NULL, CONSTRAINT "PK_5c172f81689173f75bf5906ef22" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "market_settlements" ("id" character varying NOT NULL, "amount" numeric NOT NULL, "user" text NOT NULL, "type" character varying(8) NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "market_id" character varying, CONSTRAINT "PK_e29485c52f72700921fc2eb736f" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_b5f2240a59c8d1b72ec029d3d1" ON "market_settlements" ("user") `)
        await db.query(`CREATE INDEX "IDX_7576b8515e52f177ca4797d594" ON "market_settlements" ("market_id") `)
        await db.query(`CREATE TABLE "user_balance" ("id" character varying NOT NULL, "user" text NOT NULL, "balance_change" numeric NOT NULL, "market_id" character varying, CONSTRAINT "PK_f3edf5a1907e7b430421b9c2ddd" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_0f7286bb3c5c88d8b5a7612b11" ON "user_balance" ("user") `)
        await db.query(`CREATE INDEX "IDX_99b139cd3e9dadefb8263133d7" ON "user_balance" ("market_id") `)
        await db.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_d91cc35ada00c918781b7f0599d" FOREIGN KEY ("market_id") REFERENCES "market"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "position" ADD CONSTRAINT "FK_d744886149158961e1b796182f8" FOREIGN KEY ("market_id") REFERENCES "market"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "aggregated_orders_by_price" ADD CONSTRAINT "FK_6a3c7cf051dee6be40f560f2f07" FOREIGN KEY ("market_id") REFERENCES "market"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "market_settlements" ADD CONSTRAINT "FK_7576b8515e52f177ca4797d594f" FOREIGN KEY ("market_id") REFERENCES "market"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "user_balance" ADD CONSTRAINT "FK_99b139cd3e9dadefb8263133d7c" FOREIGN KEY ("market_id") REFERENCES "market"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "market"`)
        await db.query(`DROP TABLE "order"`)
        await db.query(`DROP INDEX "public"."IDX_d91cc35ada00c918781b7f0599"`)
        await db.query(`DROP TABLE "position"`)
        await db.query(`DROP INDEX "public"."IDX_d744886149158961e1b796182f"`)
        await db.query(`DROP TABLE "aggregated_orders_by_price"`)
        await db.query(`DROP INDEX "public"."IDX_6a3c7cf051dee6be40f560f2f0"`)
        await db.query(`DROP TABLE "withdraw"`)
        await db.query(`DROP TABLE "market_settlements"`)
        await db.query(`DROP INDEX "public"."IDX_b5f2240a59c8d1b72ec029d3d1"`)
        await db.query(`DROP INDEX "public"."IDX_7576b8515e52f177ca4797d594"`)
        await db.query(`DROP TABLE "user_balance"`)
        await db.query(`DROP INDEX "public"."IDX_0f7286bb3c5c88d8b5a7612b11"`)
        await db.query(`DROP INDEX "public"."IDX_99b139cd3e9dadefb8263133d7"`)
        await db.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_d91cc35ada00c918781b7f0599d"`)
        await db.query(`ALTER TABLE "position" DROP CONSTRAINT "FK_d744886149158961e1b796182f8"`)
        await db.query(`ALTER TABLE "aggregated_orders_by_price" DROP CONSTRAINT "FK_6a3c7cf051dee6be40f560f2f07"`)
        await db.query(`ALTER TABLE "market_settlements" DROP CONSTRAINT "FK_7576b8515e52f177ca4797d594f"`)
        await db.query(`ALTER TABLE "user_balance" DROP CONSTRAINT "FK_99b139cd3e9dadefb8263133d7c"`)
    }
}
