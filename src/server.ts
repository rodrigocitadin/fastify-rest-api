import fastify from "fastify";
import crypto from "node:crypto";
import { knex } from "./database";

const app = fastify();

app.listen({ port: 3333 })
  .then(() => console.log('Server is running!'));

app.get('/hello', async () => {
  const transaction = await knex('transactions')
    .insert({
      id: crypto.randomUUID(),
      title: 'Test transaction',
      amount: 1000
    })
    .returning('*');

  return transaction;
})

app.get('/bye', async () => {
  const transaction = await knex('transactions')
    .select('*');

  return transaction;
})
