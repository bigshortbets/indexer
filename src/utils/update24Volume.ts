import { Store } from "@subsquid/typeorm-store";
import { EntityManager } from "typeorm";

export async function update24Volume(store: Store) {
  console.log("24h volume update");

  const em = (store as unknown as { em: () => EntityManager }).em;

  await (
    await em()
  ).query(`
    UPDATE "market" AS m
    SET "daily_volume" = (
        SELECT COALESCE(SUM(p."price" * p."quantity" * m."contract_unit"), 0)
        FROM "position" AS p
        WHERE p."market_id" = m."id"
          AND p."timestamp" >= NOW() - interval '1 day'
    )
    RETURNING m.*;
  `);
}
