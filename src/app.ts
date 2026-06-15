import express, { type Application, type Request, type Response } from "express"
import { initDB, pool } from "./db";
import { userRoute } from "./modules/user/user.route";

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users',userRoute);






app.put('/api/users/:id', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
            `
            SELECT users
            SET 
            name = COALESCE($1, name),
            password= COALESCE($2, password),
            age=COALESCE($3, age),
            is_active=COALESCE($4, is_active)

            WHERE id = $5 RETURNING *
            `,
        [name,password, age, is_active, id],
        );


        res.status(200).json({
            success: true,
            message: "Users retrieved successfully!",
            data: result.rows,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        });
    }
});


export default app;