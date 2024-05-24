module.exports = class Data1716551079752 {
    name = 'Data1716551079752'

    async up(db) {
        await db.query(`ALTER TABLE "order" ADD "type" character varying(7) NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "order" DROP COLUMN "type"`)
    }
}
