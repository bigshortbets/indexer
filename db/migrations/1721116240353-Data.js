module.exports = class Data1721116240353 {
    name = 'Data1721116240353'

    async up(db) {
        await db.query(`CREATE INDEX "IDX_be4d7ae4f7ae966c9a28591069" ON "historical_market_price" ("timestamp") `)
    }

    async down(db) {
        await db.query(`DROP INDEX "public"."IDX_be4d7ae4f7ae966c9a28591069"`)
    }
}
