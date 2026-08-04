import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const {
  NUXT_DB_HOST,
  NUXT_DB_PORT,
  NUXT_DB_NAME,
  NUXT_DB_USER,
  NUXT_DB_PASSWORD,
} = process.env;

const DB_URL = `postgresql://${NUXT_DB_USER}:${NUXT_DB_PASSWORD}@${NUXT_DB_HOST}:${NUXT_DB_PORT}/${NUXT_DB_NAME}`;

export default defineConfig({
  out: "./server/drizzle",
  schema: "./server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DB_URL!,
  },
});
