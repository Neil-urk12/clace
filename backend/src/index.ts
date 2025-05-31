import 'dotenv/config';
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import "../src/config/db_config";
import { authRoutes } from "./routes/authRoutes";
import { eventRoutes } from "./routes/eventRoutes";
import { calendarRoutes } from "./routes/calendarRoutes";
import { profileRoutes } from "./routes/profileRoutes";

const app = new Elysia()
  .use(cors())
  .use(authRoutes)
  .use(eventRoutes)
  .use(calendarRoutes)
  .use(profileRoutes)

app.get("/", () => "Backend is running")

app.listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
