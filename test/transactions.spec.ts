import supertest from "supertest";
import { afterAll, beforeAll, describe, it } from "vitest";
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

});
