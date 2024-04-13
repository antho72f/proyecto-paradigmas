import mssql from "mssql";
import { DB_DATABASE, DB_PASSWORD, DB_SERVER, DB_USER } from "../config.js";

const connectionSettings = {
    server: DB_SERVER,
    database: DB_DATABASE,
    user: DB_USER,
    password: DB_PASSWORD,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};


export async function getConnection(){
    try {
        const pool = await mssql.connect(connectionSettings);
        return pool;
    } catch (error) {
        console.error(error);
    }
}

export {mssql};