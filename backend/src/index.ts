import 'dotenv/config';
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import "../src/config/db_config";
import { authRoutes } from "./routes/authRoutes";

const app = new Elysia()
  .use(cors())
  .use(authRoutes)

app.get("/", () => "Backend is running")

app.listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
