module.exports = class Data1700579449169 {
  name = "Data1700579449169";

  async up(db) {
    await db.query(
      `ALTER TABLE "position" ADD "create_price" numeric NOT NULL`
    );
  }

  async down(db) {
    await db.query(`ALTER TABLE "position" DROP COLUMN "create_price"`);
  }
};
