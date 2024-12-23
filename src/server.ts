import fastify from "fastify";
import { knex } from "./database";

const app = fastify();

app.get("/hello", async () => {
    const tables = await knex("sqlite_schema").select("*");
    console.log(tables);
    return  tables;
});

app.listen({
    port: 3333,
}).then(() => {
    console.log("Server is running on port 3333");
});