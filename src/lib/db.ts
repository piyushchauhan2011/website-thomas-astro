import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import {
  customType,
  index,
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

const isISODateString = (value: string) =>
  /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(value);

/**
 * `@astrojs/db` wrote `date` columns as ISO strings into a TEXT column. Keep that
 * encoding so the rows already in the remote libSQL database stay readable, and so
 * the raw `strftime('%Y-%m-%d', date)` query in `/api/page-views` keeps working.
 */
const isoDate = customType<{ data: Date; driverData: string }>({
  dataType: () => "text",
  toDriver: (value) => value.toISOString(),
  fromDriver: (value) => new Date(isISODateString(value) ? value : `${value}Z`),
});

/** Mirrors the table `@astrojs/db` created, including its implicit `_id` primary key. */
export const PageView = sqliteTable(
  "PageView",
  {
    _id: integer("_id").primaryKey(),
    url: text("url").notNull(),
    date: isoDate("date").notNull(),
  },
  (table) => [index("url_idx").on(table.url), index("date_idx").on(table.date)],
);

/**
 * `process.env` carries the real environment on Vercel, while Astro only injects
 * `.env` files into `import.meta.env`, so read both. `import.meta.env` is absent
 * outside Vite, which is why the `db-push` and `db-seed` scripts load `.env` into
 * `process.env` themselves.
 */
const readEnv = (key: "ASTRO_DB_REMOTE_URL" | "ASTRO_DB_APP_TOKEN") =>
  process.env[key] ?? import.meta.env?.[key];

/** Falls back to a local file so `astro dev` works without remote credentials. */
const url = readEnv("ASTRO_DB_REMOTE_URL") ?? "file:.astro/local.db";
const authToken = readEnv("ASTRO_DB_APP_TOKEN");

export const db = drizzle(
  createClient(authToken ? { url, authToken } : { url }),
);
