import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";

export async function transactionsRoutes(app: FastifyInstance) {
    app.post('/', async (request, reply) => {
        const createTransactionBodySchema = z.object({
            tittle: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit']),
        });

        const { tittle, amount, type } = createTransactionBodySchema.parse(request.body);

        await knex('transactions').insert({
            id: randomUUID(),
            tittle,
            amount: type === 'credit' ? amount : amount * -1,
        });

        return reply.status(201).send();
    });
}
