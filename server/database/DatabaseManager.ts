import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();

export class DatabaseManager {
    private static conn?: mysql.Connection;

    private static getConnection =
        async (): Promise<mysql.Connection | null> => {
            if (!this.conn) {
                this.conn = await mysql.createConnection({
                    host: process.env.DB_HOST,
                    port: Number(process.env.DB_PORT),
                    user: process.env.DB_USER,
                    database: process.env.DATABASE,
                    password: process.env.DB_PASSWORD,
                });

                this.conn.connect(function (err) {
                    if (err) throw err;

                    return DatabaseManager.conn;
                });
            }
            return this.conn;
        };

    static executeQuery = (
        query: string | mysql.QueryOptions
    ): Promise<any> => {
        return new Promise((resolve, reject) => {
            this.getConnection().then((db) =>
                db?.query(query, (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                })
            );
        });
    };
}
