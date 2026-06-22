import dotenv from "dotenv"
// import type { SignOptions } from "jsonwebtoken";
import path from "path"

dotenv.config({
    path: path.join(process.cwd(), '.env'),
});


const config = {
    connection_sting: process.env.CONNECTION_STRING as string,
    port: process.env.PORT,
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
}

export default config;