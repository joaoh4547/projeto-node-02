import { Knex, knex as setupKnex } from "knex";


export const config: Knex.Config = {
    client: "sqlite",
    connection: {
        filename: "./db/database.sqlite",
    },
    useNullAsDefault: true,
    migrations : {
        extension: "ts",
        directory: "./db/migrations"
    }
};
const knex = setupKnex(config);

export { knex };
