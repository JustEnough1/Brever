import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();

// Класс, отвечающий за подключение к базе данных и
// выполнение запросов к базе данных
export class DatabaseManager {
    private static conn?: mysql.Connection;

    static getConnection = async (): Promise<mysql.Connection | null> => {
        try {
            if (!this.conn) {
                this.conn = await mysql.createConnection({
                    host: process.env.DB_HOST,
                    port: Number(process.env.DB_PORT),
                    user: process.env.DB_USER,
                    database: process.env.DATABASE,
                    password: process.env.DB_PASSWORD,
                });

                await new Promise<void>((resolve, reject) => {
                    this.conn?.connect(function (err) {
                        if (err) reject(err);
                        resolve();
                    });
                });
            }
            return this.conn;
        } catch (error) {
            console.log("Error connecting to the database:", error);
            return null;
        }
    };

    static executeQuery = (
        query: string | mysql.QueryOptions
    ): Promise<any> => {
        return new Promise((resolve, reject) => {
            this.getConnection()
                .then((db) =>
                    db?.query(query, (err, res) => {
                        if (err) reject(err);
                        resolve(res);
                    })
                )
                .catch((error) => console.log(error));
        });
    };
}

// Отлавливатель ошибок
DatabaseManager.getConnection().then((conn) =>
    conn?.on("error", (err) => {
        console.log("Database error occured: ", err);
    })
);
