import { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { knex } from "../database";
import { checkSessionIdExists } from "../middlewares/check-session-is-exists";
export async function transactionRoutes(app: FastifyInstance) {
   
    app.get("/", {
        preHandler: [checkSessionIdExists]
    }, async (req) => {
        const { sessionId } = req.cookies;
        const transactions = await knex("transactions").where("session_id", sessionId).select("*");
        return { data: transactions };
    });

    app.get("/:id", {
        preHandler: [checkSessionIdExists]
    }, async (req, res) => {

        const getTransactionParamsSchema = z.object({
            id: z.string().uuid()
        });

        const { sessionId } = req.cookies;
        const { id } = getTransactionParamsSchema.parse(req.params);

        const transaction = await knex("transactions").where({
            id,
            session_id: sessionId
        }).first();
        if (!transaction) {
            return res.status(404).send({ error: "Transaction not found" });
        }
        return res.status(200).send({ data: transaction });
    });

    app.get("/summary", {
        preHandler: [checkSessionIdExists]
    }, async (req) => {
        const { sessionId } = req.cookies;
        const summary = await knex("transactions")
            .where("session_id", sessionId)
            .sum("amount", { as: "amount" }).first();
        return { summary };
    });

    app.post("/", async (req, res) => {
        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(["credit", "debit"])
        });

        const body = createTransactionBodySchema.parse(req.body);
        const { title, amount, type } = body;

        let sessionId = req.cookies.sessionId;

        if (!sessionId) {
            sessionId = randomUUID();
            res.setCookie("sessionId", sessionId, {
                path: "/",
                maxAge: 60 * 60 * 24 * 7  // 7 days
            });
        }

        await knex("transactions").insert({
            id: randomUUID(),
            title,
            amount: type === "credit" ? amount : amount * -1,
            session_id: sessionId
        });

        return res.status(200).send();
    });

}