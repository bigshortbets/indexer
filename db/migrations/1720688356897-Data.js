module.exports = class Data1720688356897 {
    name = 'Data1720688356897'

    async up(db) {
        await db.query(`CREATE TABLE "historical_market_price" ("id" character varying NOT NULL, "price" numeric NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "market_id" character varying, CONSTRAINT "PK_1778ef77a871288a42247346dcf" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_df5a69d06eda77d6090b1b2c3b" ON "historical_market_price" ("market_id") `)
        await db.query(`ALTER TABLE "historical_market_price" ADD CONSTRAINT "FK_df5a69d06eda77d6090b1b2c3b0" FOREIGN KEY ("market_id") REFERENCES "market"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "historical_market_price"`)
        await db.query(`DROP INDEX "public"."IDX_df5a69d06eda77d6090b1b2c3b"`)
        await db.query(`ALTER TABLE "historical_market_price" DROP CONSTRAINT "FK_df5a69d06eda77d6090b1b2c3b0"`)
    }
}
