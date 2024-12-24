import supertest from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../src/app";

describe("Transaction routes", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
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
        const createResponse =  await supertest(app.server)
            .post("/transactions")
            .send({
                title: "New transaction",
                amount: 5000,
                type: "credit"
            });

        const cookies = createResponse.get("Set-Cookie")!;
        const listResponse =await supertest(app.server)
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
});
