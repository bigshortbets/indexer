module.exports = class Data1689596467641 {
    name = 'Data1689596467641'

    async up(db) {
        await db.query(`CREATE TABLE "market" ("id" character varying NOT NULL, "ticker" text, CONSTRAINT "PK_1e9a2963edfd331d92018e3abac" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "market"`)
    }
}
