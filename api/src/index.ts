import { Elysia} from "elysia";
import { authRouter } from "../controllers/auth";



const app = new Elysia()
// .use(swagger())
.get("/", () => "Hello Elysia")
.use(authRouter)
.listen(3000);





/**
 * ? for testig
 * export type App = typeof app;
 */