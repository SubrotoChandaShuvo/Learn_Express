import { pool } from "../../db";
import type { IUser } from "./user.interface";

const createUserIntoDB = async (payload: IUser) => {
    const { name, email, password, age } = payload;

    const result = await pool.query(`    
        INSERT INTO users(name, email, password, age) VALUES($1, $2, $3, $4) RETURNING *;
    `, [name, email, password, age]);

    return result;
}

const getAllUsersFromDB = async () => {
    const result = await pool.query(`
        SELECT * FROM users
        `)
    return result;
}

const getSingleUserFromDB = async (id: string) => {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1;`, [id]);
    return result;
}

export const userService = {
    createUserIntoDB,
    getAllUsersFromDB,
    getSingleUserFromDB
}