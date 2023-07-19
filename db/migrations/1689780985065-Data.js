module.exports = class Data1689780985065 {
    name = 'Data1689780985065'

    async up(db) {
        await db.query(`CREATE TABLE "order" ("id" character varying NOT NULL, "price" numeric NOT NULL, "quantity" numeric NOT NULL, "side" text, "who" text, "market_id" character varying, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_d91cc35ada00c918781b7f0599" ON "order" ("market_id") `)
        await db.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_d91cc35ada00c918781b7f0599d" FOREIGN KEY ("market_id") REFERENCES "market"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "order"`)
        await db.query(`DROP INDEX "public"."IDX_d91cc35ada00c918781b7f0599"`)
        await db.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_d91cc35ada00c918781b7f0599d"`)
    }
}
