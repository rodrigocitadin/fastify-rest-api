import { Knex, knex as knexSetup } from 'knex';
import { env } from '../env';

export const config: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: env.DATABASE_URL
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './priv/migrations'
  }
};

export const knex = knexSetup(config);