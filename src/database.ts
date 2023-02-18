import { knex as knexSetup } from 'knex';

export const knex = knexSetup({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'fastify_rest_api'
  }
});