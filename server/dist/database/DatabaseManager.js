"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseManager = void 0;
const mysql_1 = __importDefault(require("mysql"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Класс, отвечающий за подключение к базе данных и
// выполнение запросов к базе данных
class DatabaseManager {
}
_a = DatabaseManager;
DatabaseManager.getConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!_a.conn) {
            _a.conn = yield mysql_1.default.createConnection({
                host: process.env.DB_HOST,
                port: Number(process.env.DB_PORT),
                user: process.env.DB_USER,
                database: process.env.DATABASE,
                password: process.env.DB_PASSWORD,
            });
            yield new Promise((resolve, reject) => {
                var _b;
                (_b = _a.conn) === null || _b === void 0 ? void 0 : _b.connect(function (err) {
                    if (err)
                        reject(err);
                    resolve();
                });
            });
        }
        return _a.conn;
    }
    catch (error) {
        console.log("Error connecting to the database:", error);
        return null;
    }
});
DatabaseManager.executeQuery = (query) => {
    return new Promise((resolve, reject) => {
        _a.getConnection()
            .then((db) => db === null || db === void 0 ? void 0 : db.query(query, (err, res) => {
            if (err)
                reject(err);
            resolve(res);
        }))
            .catch((error) => console.log(error));
    });
};
exports.DatabaseManager = DatabaseManager;
// Отлавливатель ошибок
DatabaseManager.getConnection().then((conn) => conn === null || conn === void 0 ? void 0 : conn.on("error", (err) => {
    console.log("Database error occured: ", err);
}));
