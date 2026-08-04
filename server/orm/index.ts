import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

const config = useRuntimeConfig();

const { dbUser, dbPassword, dbHost, dbPort, dbName } = config;

const DB_URL = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

console.log("DB_URL", DB_URL);

export const db = drizzle(DB_URL as string);
