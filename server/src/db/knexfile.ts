import { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
    development: {
        client: 'pg',
        connection: {
            host: '127.0.0.1',
            user: 'postgres',
            port: 5432,
            password: 'kiruna07',
            database: 'kirunadb',
        },
        migrations: {
            directory: './src/db/migrations',
        }
    }
}

export default config;