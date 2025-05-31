import 'dotenv/config';
import { Elysia } from "elysia";
import "../src/config/db_config";

const app = new Elysia()

app.get("/", () => "Backend is running")

app.listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
