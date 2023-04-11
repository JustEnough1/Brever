import express from "express";
import { authRouter } from "./routes/auth";

const PORT = 3000;

const app = express();

app.use(express.json());
app.use("/auth", authRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
