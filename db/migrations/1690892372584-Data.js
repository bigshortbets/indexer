module.exports = class Data1690892372584 {
    name = 'Data1690892372584'

    async up(db) {
        await db.query(`ALTER TABLE "position" DROP COLUMN "block_height"`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "position" ADD "block_height" numeric NOT NULL`)
    }
}
