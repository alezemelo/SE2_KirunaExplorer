// import { Knex } from "knex";

// const config: { [key: string]: Knex.Config } = {
//     development: {
//         client: 'pg',
//         connection: {
//             host: '127.0.0.1',
//             user: 'postgres',
//             port: 5432,
//             password: 'kiruna07',
//             database: 'kirunadb',
//         },
//         migrations: {
//             directory: './src/db/migrations',
//         }
//     },
//     test: {
//         client: 'sqlite3',
//         connection: {
//           filename: ':memory:',
//         },
//         useNullAsDefault: true,
//         migrations: {
//           directory: './src/db/migrations',
//         },
//       },
// }

// export default config;


import { Knex } from 'knex';
import path from 'path';

const migrations_path = path.join(__dirname, 'migrations');

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      //host: '127.0.0.1',
      host: 'database',
      user: 'postgres',
      password: 'kiruna07',
      database: 'kirunadb',
      port: 5432,
    },
    migrations: {
      directory: migrations_path,
    },
  },
  test: {
    client: 'pg',
    connection: {
      //host: '127.0.0.1',
      host: 'database',
      user: 'postgres',
      password: 'kiruna07',
      database: 'kirunadb', // Separate test database
      port: 5432,
    },
    migrations: {
      directory: migrations_path,
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL, // Use environment variable for production DB URL
    migrations: {
      directory: migrations_path,
    },
  },
};

export default config;
