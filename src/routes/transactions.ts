import { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { knex } from "../database";
export async function transactionRoutes(app: FastifyInstance) {

    app.get("/", async (req, res) => {
        const transactions = await knex("transactions").select("*");
        return res.status(200).send({ data: transactions });
    });

    app.get("/:id", async (req, res) => {

        const getTransactionParamsSchema = z.object({
            id: z.string().uuid()
        });

        const { id } = getTransactionParamsSchema.parse(req.params);

        const transaction = await knex("transactions").where("id", id).first();
        if (!transaction) {
            return res.status(404).send({ error: "Transaction not found" });
        }
        return res.status(200).send({ data: transaction });
    });

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