import {config} from 'dotenv'
config();

export const PORT =  process.env.PORT || 8000;
export const DB_USER = process.env.DB_USER || "sa";
export const DB_PASSWORD = process.env.DB_PASSWORD || "1234";
export const DB_SERVER = process.env.DB_SERVER || "THONY\\SQLEXPRESS";
export const DB_DATABASE = process.env.DB_DATABASE || "GEADC";
export const JWT_SECRET = process.env.JWT_SECRET || "Hndl293na!";
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
