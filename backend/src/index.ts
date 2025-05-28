import { Elysia } from "elysia";
import mysql from "mysql2/promise";
// import { createConnection } from "mysql2/promise";
const app = new Elysia()

const DB_NAME = "bun_db";
const DB_USER = "bun_user";
const DB_PASS = "bun_password";
const DB_HOST = "localhost";

async function ensureDatabaseExists() {
  // Connect without specifying database first (to create DB)
  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``); //creat db if not exist
  await connection.end();
}

async function createUsersTable(pool: mysql.Pool) { //create tavle if not exist
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100)  NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await pool.query(createTableSQL);

  const testuser = {password:"123456", email:"test@email.com"};
  try { //create initial data
      const [result] = await pool.query(
        "INSERT INTO users (email,password) VALUES (?, ?)",
        [testuser.email, testuser.password]
      );

      return { id: (result as any).insertId, email: testuser.email, password: testuser.password };
    } catch (error:any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  };
}

async function main() {
  await ensureDatabaseExists();

  const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  await createUsersTable(pool);


  // GET /users — list all users
  app.get("/users", async () => {
    const [rows] = await pool.query("SELECT * FROM users");
    return rows;
  });

  // POST /register — insert new user, expects JSON { name, email }
  app.post("/register", async ({ body }) => {
    if (!body || !body.email || !body.password) { //check if name and email is recieved
      return new Response(
      JSON.stringify({ error: "Missing email or password" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
      );
    }

    try {//insert values
      const [result] = await pool.query(
        "INSERT INTO users (email,password) VALUES (?, ?)",
        [body.email, body.password]
      );

      return { id: (result as any).insertId, email: body.email, password: body.password };
    } catch (error:any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  });

  //login
  app.post("/login", async ({ body }) => {
  const { email, password } = body;

  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Email and password required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password]
    );

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid email or password" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Login success
    return new Response(JSON.stringify({
      message: "Login successful",
      user: {
        id: rows[0].id,
        name: rows[0].name,
        email: rows[0].email
      }
    }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err:any) {
    return new Response(JSON.stringify({ error: "Server error", details: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  });

  app.listen(3000);
  console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);

}

main().catch(console.error);

