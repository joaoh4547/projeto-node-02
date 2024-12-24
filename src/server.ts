import fastify from "fastify";
import { env } from "./env";
import { transactionRoutes } from "./routes/transactions";
import cookie from "@fastify/cookie";

const app = fastify();

app.register(cookie);
app.addHook("preHandler", async (req) => {
    console.log(`[${req.method}] ${req.url} `);
});
app.register(transactionRoutes,{
    prefix: "transactions"
});

app
    .listen({
        port: env.PORT,
    })
    .then(() => {
        console.log(`Server is running on port ${env.PORT}`);
    });
