import { DatabaseSync } from "node:sqlite";

export const database = new DatabaseSync("./src/shared/database/db.sqlite");
export const runSeed = () => {
  database.exec(`
    DROP TABLE IF EXISTS measurement;
    DROP TABLE IF EXISTS customer;
    `);

  database.exec(`
            CREATE TABLE customer(
                customer_code string PRIMARY KEY)
            `);
  database.exec(`
            CREATE TABLE measurement(
                measure_uuid string PRIMARY KEY,
                measure_datetime date,
                measure_value,
                measure_type string,
                has_confirmed boolean,
                customer_code string NOT NULL,
                FOREIGN KEY (customer_code) REFERENCES customer (customer_code)
  )`);
};
