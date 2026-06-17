import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";


const createUser = async (req: Request, res: Response) => {
    // console.log(req.body);
    // const { name, email, password, age } = req.body;

    try {
        const result = await userService.createUserIntoDB(req.body)

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
}

const getAllUsers = async (req: Request, res: Response) => {
    //   res.send('Hello user!!!!')
    try {
        const result = await userService.getAllUsersFromDB();
        res.status(200).json({
            "message": "Express Server",
            "Author": "Subroto Chanda shuvo",
            data: result.rows
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        });
    }

}

const getSingleUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await userService.getSingleUserFromDB(id as string);

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
}

const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await userService.updateUserFromDB(req.body, id as string )

        if(result.rows.length === 0) { 
            return res.status(500).json({
                success: false,
                message: "User not found!",
                data : {}
            });
        }

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
}


const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await userService.deleteUserFromDB(id as string);

        if(result.rowCount === 0) { 
            return res.status(500).json({
                success: false,
                message: "User not found!",
                data : {}
            });
        }
        
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
}

export const userController = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser
}