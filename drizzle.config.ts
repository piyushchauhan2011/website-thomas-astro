import { defineConfig } from "drizzle-kit";

// drizzle-kit runs outside Vite, so `.env` is not loaded for us.
try {
  process.loadEnvFile();
} catch {
  // No `.env` file: fall back to the local SQLite file below.
}

const url = process.env.ASTRO_DB_REMOTE_URL ?? "file:.astro/local.db";
const authToken = process.env.ASTRO_DB_APP_TOKEN;

export default defineConfig({
  dialect: "turso",
  schema: "./src/lib/db.ts",
  out: "./db/migrations",
  dbCredentials: authToken ? { url, authToken } : { url },
});
