module.exports = class Data1707984567968 {
    name = 'Data1707984567968'

    async up(db) {
        await db.query(`ALTER TABLE "order" DROP COLUMN "status"`)
        await db.query(`ALTER TABLE "order" ADD "status" character varying(23) NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "order" ADD "status" character varying(13) NOT NULL`)
        await db.query(`ALTER TABLE "order" DROP COLUMN "status"`)
    }
}
