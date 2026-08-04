import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

const config = useRuntimeConfig();

const { dbUser, dbPassword, dbHost, dbPort, dbName } = config;

const DB_URL = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

export const db = drizzle(DB_URL as string);
