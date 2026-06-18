import express, { type Application, type Request, type Response } from "express"
import { initDB, pool } from "./db";
import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRoute } from "./modules/auth/auth.route";
import fs from "fs";
import logger from "./middleware/logger";

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Express Server!",
        author: "Subro"
    });
})

app.use('/api/users', userRoute);
app.use('/api/profile', profileRoute);
app.use("/api/auth", authRoute);


export default app;