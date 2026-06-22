import { pool } from "../../db";

const createProfileIntoDB = async (payload: any) => {
    //  console.log(payload);
    const { user_id, bio, address, phone, gender } = payload;
    //First check if the user is exists
    const user = await pool.query(`
        SELECT * FROM users WHERE id=$1
        `, [user_id]);

    // console.log(user);
    if (user.rows.length === 0) {
        throw new Error("User not exists!")
    }

    const result = await pool.query(`
        INSERT INTO profiles(
        user_id, bio, address, phone, gender
        ) VALUES($1,$2,$3,$4,$5) RETURNING *
        ` , [user_id, bio, address,phone, gender]);

    return result;
}

const getAllProfileFromDB = async ( )=>{
    const result = await pool.query(`
        SELECT * FROM profiles
        `)
        return result;
}

export const profileService = {
    createProfileIntoDB,
    getAllProfileFromDB
}