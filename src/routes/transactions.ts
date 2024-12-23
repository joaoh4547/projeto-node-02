import { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { knex } from "../database";
export async function transactionRoutes(app: FastifyInstance) {
    app.post("/", async (req, res) => {
        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(["credit", "debit"])
        });

        const body = createTransactionBodySchema.parse(req.body);
        const { title, amount, type } = body;

        await knex("transactions").insert({
            id: randomUUID(),
            title,
            amount: type === "credit" ? amount : amount * -1
        });

        return res.status(200).send();
    });

}