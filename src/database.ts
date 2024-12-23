import "dotenv/config";
import { Knex, knex as setupKnex } from "knex";

if(!process.env.DATABASE_URL){
    throw new Error("No DATABASE_URL environment variable found.");
}

console.log(process.env);
export const config: Knex.Config = {
    client: "sqlite",
    connection: {
        filename: process.env.DATABASE_URL,
    },
    useNullAsDefault: true,
    migrations : {
        extension: "ts",
        directory: "./db/migrations"
    }
};
const knex = setupKnex(config);

export { knex };
