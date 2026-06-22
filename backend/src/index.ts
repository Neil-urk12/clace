import 'dotenv/config';
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import "../src/config/db_config";
import { authRoutes, authProtectedRoutes } from "./routes/authRoutes";
import { eventRoutes } from "./routes/eventRoutes";
import { calendarRoutes } from "./routes/calendarRoutes";
import { profileRoutes } from "./routes/profileRoutes";
import { successWrap } from "./plugins/successWrap";
import { errorHandler } from "./plugins/errorHandler";

const app = new Elysia()
  .use(cors())
  .use(successWrap)
  .use(errorHandler)
  .use(authRoutes)
  .use(authProtectedRoutes)
  .use(eventRoutes)
  .use(calendarRoutes)
  .use(profileRoutes)

app.get("/", () => "Backend is running")

app.listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
