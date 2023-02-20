import { Knex, knex as knexSetup } from 'knex';

export const config: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: './priv/db/app.db'
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './priv/migrations'
  }
};

export const knex = knexSetup(config);