import { FastifyInstance } from "fastify";
import { knex } from "../database";

export async function transactionRoutes(app: FastifyInstance){
    app.get("/hello", async () => {
        const transaction = await knex("transactions")
            .where("amount", 1000)
            .select("*");
        return transaction;
    });

}