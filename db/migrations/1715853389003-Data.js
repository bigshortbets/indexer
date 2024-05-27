module.exports = class Data1715853389003 {
    name = 'Data1715853389003'

    async up(db) {
        await db.query(`ALTER TABLE "market" ADD "status" character varying(5) NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "market" DROP COLUMN "status"`)
    }
}
