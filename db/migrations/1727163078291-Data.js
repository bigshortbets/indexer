module.exports = class Data1727163078291 {
    name = 'Data1727163078291'

    async up(db) {
        await db.query(`CREATE TABLE "market_chart_feed15_min" ("id" character varying NOT NULL, "close" numeric NOT NULL, "open" numeric NOT NULL, "low" numeric NOT NULL, "high" numeric NOT NULL, "time" numeric NOT NULL, "market_id" character varying, CONSTRAINT "PK_7d7a3943f077c5f996fb8a2910f" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_ac38c3f5537e678079a47bf200" ON "market_chart_feed15_min" ("time") `)
        await db.query(`CREATE INDEX "IDX_f74646c36ad932b6dfd28d174b" ON "market_chart_feed15_min" ("market_id") `)
        await db.query(`CREATE TABLE "market_chart_feed1_h" ("id" character varying NOT NULL, "close" numeric NOT NULL, "open" numeric NOT NULL, "low" numeric NOT NULL, "high" numeric NOT NULL, "time" numeric NOT NULL, "market_id" character varying, CONSTRAINT "PK_a4f89643ebe16ed81fb2e367fdd" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_0cf66d0b4f5d294d055c2d1279" ON "market_chart_feed1_h" ("time") `)
        await db.query(`CREATE INDEX "IDX_f29cf346cafe5fa232defb800f" ON "market_chart_feed1_h" ("market_id") `)
        await db.query(`ALTER TABLE "market_chart_feed15_min" ADD CONSTRAINT "FK_f74646c36ad932b6dfd28d174b2" FOREIGN KEY ("market_id") REFERENCES "market"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "market_chart_feed1_h" ADD CONSTRAINT "FK_f29cf346cafe5fa232defb800f4" FOREIGN KEY ("market_id") REFERENCES "market"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "market_chart_feed15_min"`)
        await db.query(`DROP INDEX "public"."IDX_ac38c3f5537e678079a47bf200"`)
        await db.query(`DROP INDEX "public"."IDX_f74646c36ad932b6dfd28d174b"`)
        await db.query(`DROP TABLE "market_chart_feed1_h"`)
        await db.query(`DROP INDEX "public"."IDX_0cf66d0b4f5d294d055c2d1279"`)
        await db.query(`DROP INDEX "public"."IDX_f29cf346cafe5fa232defb800f"`)
        await db.query(`ALTER TABLE "market_chart_feed15_min" DROP CONSTRAINT "FK_f74646c36ad932b6dfd28d174b2"`)
        await db.query(`ALTER TABLE "market_chart_feed1_h" DROP CONSTRAINT "FK_f29cf346cafe5fa232defb800f4"`)
    }
}
