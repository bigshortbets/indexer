module.exports = class Data1698844323915 {
    name = 'Data1698844323915'

    async up(db) {
        try {
            await db.startTransaction();

            await db.query('BEGIN');
            await db.query('ALTER TABLE "position" ADD "entry_price" numeric;');
            await db.query('UPDATE "position" SET entry_price = price;');
            await db.query('ALTER TABLE "position" ALTER COLUMN entry_price SET NOT NULL;');

            await db.commitTransaction();
        } catch (error) {
            await db.rollbackTransaction();
            throw error;
        }
    }

    async down(db) {
        await db.query(`ALTER TABLE "position" DROP COLUMN "entry_price"`)
    }
}
