import mysql from "mysql2/promise";

const pool = mysql.createPool(process.env.DB_URL);

const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("MYSQL CONNECTED successfully");
    connection.release();
  } catch (error) {
    console.error("Error connecting to MYSQL:", error.message);
    process.exit(1);
  }
};

export { connectDB, pool };
