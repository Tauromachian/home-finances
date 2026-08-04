import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

const config = useRuntimeConfig();

const DB_URL = config.DB_URL;

export const db = drizzle(DB_URL as string);
