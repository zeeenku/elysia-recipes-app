import { Elysia } from "elysia";

const app = new Elysia()

.get("/", () => "Hello Elysia")
.listen(3000);




/**
 * ? for testig
 * export type App = typeof app;
 */