module.exports = class Data1721118150560 {
    name = 'Data1721118150560'

    async up(db) {
        await db.query(`CREATE INDEX "IDX_9f1336131a4147007274b15a73" ON "market" ("ticker") `)
        await db.query(`CREATE INDEX "IDX_ee64b5730bbb93f419da883b63" ON "order" ("who") `)
        await db.query(`CREATE INDEX "IDX_bb489c1da3a3c51bcdff48a58d" ON "order" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_7a9573d6a1fb982772a9123320" ON "order" ("status") `)
        await db.query(`CREATE INDEX "IDX_5cac3506e32e55950d2696a526" ON "position" ("long") `)
        await db.query(`CREATE INDEX "IDX_68b8c7b0392536291552da9eaf" ON "position" ("short") `)
        await db.query(`CREATE INDEX "IDX_9d6454e1ee6dcd7b6b3e653a08" ON "position" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_d38e90b7449b4bd8bbbf5d518d" ON "position" ("status") `)
        await db.query(`CREATE INDEX "IDX_c12a3b5f132452b40424dd8caf" ON "aggregated_orders_by_price" ("side") `)
    }

    async down(db) {
        await db.query(`DROP INDEX "public"."IDX_9f1336131a4147007274b15a73"`)
        await db.query(`DROP INDEX "public"."IDX_ee64b5730bbb93f419da883b63"`)
        await db.query(`DROP INDEX "public"."IDX_bb489c1da3a3c51bcdff48a58d"`)
        await db.query(`DROP INDEX "public"."IDX_7a9573d6a1fb982772a9123320"`)
        await db.query(`DROP INDEX "public"."IDX_5cac3506e32e55950d2696a526"`)
        await db.query(`DROP INDEX "public"."IDX_68b8c7b0392536291552da9eaf"`)
        await db.query(`DROP INDEX "public"."IDX_9d6454e1ee6dcd7b6b3e653a08"`)
        await db.query(`DROP INDEX "public"."IDX_d38e90b7449b4bd8bbbf5d518d"`)
        await db.query(`DROP INDEX "public"."IDX_c12a3b5f132452b40424dd8caf"`)
    }
}
