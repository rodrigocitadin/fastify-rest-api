import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { checkSessionId } from "../middlewares/check_session_id";

export async function transactionsRoutes(app: FastifyInstance) { 
    app.get(
        '/',
        {
            preHandler: [checkSessionId]
        },
        async (request) => {
            const { sessionId } = request.cookies;

            const transactions = await knex('transactions')
                .where('session_Id', sessionId)
                .select();

            return { transactions };
        });

    app.get(
        '/:id',
        {
            preHandler: [checkSessionId]
        },
        async (request) => {
            const getTransactionsParamsSchema = z.object({
                id: z.string().uuid()
            })
            const { sessionId } = request.cookies;


            const { id } = getTransactionsParamsSchema
                .parse(request.params);

            const transactions = await knex('transactions')
                .where({ id, session_id: sessionId })
                .first();

            return { transactions };
        });

    app.get(
        '/summary',
        {
            preHandler: [checkSessionId]
        },
        async (request) => {
            const { sessionId } = request.cookies;

            const summary = await knex('transactions')
                .where('session_id', sessionId)
                .sum('amount', { as: 'amount' })
                .first()

            return { summary };
        });

    app.post(
        '/',
        async (request, reply) => {
            const createTransactionBodySchema = z.object({
                title: z.string(),
                amount: z.number(),
                type: z.enum(['credit', 'debit']),
            });

            const { title, amount, type } = createTransactionBodySchema.parse(request.body);

            let sessionId = request.cookies.sessionId;

            if (!sessionId) {
                sessionId = randomUUID();

                reply.setCookie('sessionId', sessionId, {
                    path: '/',
                    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
                })
            }

            await knex('transactions').insert({
                id: randomUUID(),
                title,
                amount: type === 'credit' ? amount : amount * -1,
                session_id: sessionId,
            });

            return reply.status(201).send();
        });
}
