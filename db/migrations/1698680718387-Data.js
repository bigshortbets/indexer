module.exports = class Data1698680718387 {
    name = 'Data1698680718387'

    async up(db) {
        await db.query(`ALTER TABLE "position" ADD "open_price" numeric NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "position" DROP COLUMN "open_price"`)
    }
}
