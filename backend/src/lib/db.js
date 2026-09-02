import mysql from "mysql2/promise";
import winston from "winston";

const pool = mysql.createPool(process.env.DB_URL);

const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    winston.info("MYSQL CONNECTED successfully");
    connection.release();
  } catch (error) {
    winston.error("Error connecting to MYSQL:", error.message);
    process.exit(1);
  }
};

export { connectDB, pool };
