import { Router, type Request, type Response } from "express";
import { pool } from "../../db";
import { userController } from "./user.controller";

const router = Router()


router.post('/', userController.createUser);

router.get('/', userController.getAllUsers);

router.get('/:id', userController.getSingleUser);

export const userRoute = router;