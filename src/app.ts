import express, { type Application, type Request, type Response } from "express"
import { initDB, pool } from "./db";

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));



app.get('/', (req: Request, res: Response) => {
    //   res.send('Hello user!!!!')
    res.status(200).json({
        "message": "Express Server",
        "Author": "Subroto Chanda shuvo",
    })
});

app.post('/api/users', async (req: Request, res: Response) => {
    // console.log(req.body);
    const { name, email, password, age } = req.body;

    try {
        const result = await pool.query(`    
        INSERT INTO users(name, email, password, age) VALUES($1, $2, $3, $4) RETURNING *;
    `, [name, email, password, age]);

        // console.log(result.rows[0]);

        res.status(201).json({
            success: true,
            message: "User Created Successfully!",
            data: result.rows[0],
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        });
    }
});


app.get('/api/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`SELECT * FROM users WHERE id = $1;`, [id]);

        if(result.rows.length === 0) {
            return res.status(500).json({
                success: false,
                message: "User not found!",
                data : {}
            });
        }

        res.status(200).json({
            success: true,
            message: "User retrieved successfully!",
            data: result.rows[0],

        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        });
    }
});




app.get('/api/users', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`SELECT * FROM users;`);
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