import { execSync } from "child_process";
import supertest from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app";

describe("Transaction routes", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {
        execSync("npm run knex migrate:rollback --all");
        execSync("npm run knex migrate:latest");
    });

    it("should be able to create a new transaction", async () => {
        await supertest(app.server)
            .post("/transactions")
            .send({
                title: "New transaction",
                amount: 5000,
                type: "credit"
            }).expect(201);
    });

    it("should be able to list all transactions", async () => {
        const createResponse = await supertest(app.server)
            .post("/transactions")
            .send({
                title: "New transaction",
                amount: 5000,
                type: "credit"
            });

        const cookies = createResponse.get("Set-Cookie")!;
        const listResponse = await supertest(app.server)
            .get("/transactions")
            .set("Cookie", cookies)
            .expect(200);

        expect(listResponse.body.data).toEqual([
            expect.objectContaining({
                title: "New transaction",
                amount: 5000
            })
        ]);
    });

    it("should be able to get specific transaction", async () => {
        const createResponse = await supertest(app.server)
            .post("/transactions")
            .send({
                title: "New transaction",
                amount: 5000,
                type: "credit"
            });

        const cookies = createResponse.get("Set-Cookie")!;
        const listResponse = await supertest(app.server)
            .get("/transactions")
            .set("Cookie", cookies)
            .expect(200);


        const transactionId = listResponse.body.data[0].id;

        const transactionResponse = await supertest(app.server).get(`/transactions/${transactionId}`).set("Cookie", cookies).expect(200);

        expect(transactionResponse.body.data).toEqual(
            expect.objectContaining({
                title: "New transaction",
                amount: 5000
            })
        );
    });

    it("should be able to get the sumary", async () => {
        const createResponse = await supertest(app.server)
            .post("/transactions")
            .send({
                title: "New transaction",
                amount: 5000,
                type: "credit"
            });

        const cookies = createResponse.get("Set-Cookie")!;

        await supertest(app.server)
            .post("/transactions")
            .set("Cookie",cookies)
            .send({
                title: "Debit transaction",
                amount: 2000,
                type: "debit"
            });

        const summaryResponse = await supertest(app.server)
            .get("/transactions/summary")
            .set("Cookie", cookies)
            .expect(200);

        expect(summaryResponse.body.summary).toEqual({amount: 3000 });
    });
});
