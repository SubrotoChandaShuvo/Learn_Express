import type { NextFunction, Request, Response } from "express";
import fs from "fs";

const logger = (req : Request, res: Response, next : NextFunction) => {
    console.log('Method - URL - Time:', req.method, req.url, Date.now());
    const log = `
Time   : ${new Date().toISOString()}
Method : ${req.method}
URL    : ${req.url}
--------------------------------
`;
    fs.appendFile('logger.text', log, (err) => {
        console.log(err);
    })
    next();
}


export default logger;