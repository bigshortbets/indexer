module.exports = class Data1689770660823 {
    name = 'Data1689770660823'

    async up(db) {
        await db.query(`CREATE TABLE "market" ("id" character varying NOT NULL, "ticker" text, "tick_size" numeric, "lifetime" numeric, "initial_margin" numeric, "maintanance_margin" numeric, "contract_unit" numeric, CONSTRAINT "PK_1e9a2963edfd331d92018e3abac" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "market"`)
    }
}
