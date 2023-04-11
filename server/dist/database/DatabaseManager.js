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
class DatabaseManager {
}
_a = DatabaseManager;
DatabaseManager.getConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!_a.conn) {
        _a.conn = yield mysql_1.default.createConnection({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            database: process.env.DATABASE,
            password: process.env.DB_PASSWORD,
        });
        _a.conn.connect(function (err) {
            if (err)
                throw err;
            return DatabaseManager.conn;
        });
    }
    return _a.conn;
});
DatabaseManager.executeQuery = (query) => {
    return new Promise((resolve, reject) => {
        _a.getConnection().then((db) => db === null || db === void 0 ? void 0 : db.query(query, (err, res) => {
            if (err)
                reject(err);
            resolve(res);
        }));
    });
};
exports.DatabaseManager = DatabaseManager;
