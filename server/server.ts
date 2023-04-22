import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth";
import { usersRouter } from "./routes/users";

dotenv.config();

const PORT = 3000;

const app = express();

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
});

app.use(express.json());
app.use(sessionMiddleware);

app.use("/auth", authRouter);
app.use("/users", usersRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
