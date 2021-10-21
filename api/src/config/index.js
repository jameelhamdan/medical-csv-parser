import path from "path";

export const dbConnection = {
    "database": "medical_csv_parser",
    "username": "postgres",
    "host": "localhost",
    "port": 5432,
    "password": "1234",
    "dialect": "postgres",
    "operatorsAliases": false
}

export const uploadPath = path.join(path.resolve(), '../media/files');
