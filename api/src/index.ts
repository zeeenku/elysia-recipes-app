import { Elysia, t } from "elysia";
import { PrismaClient, UserRole } from '@prisma/client'
import { checkGuest, generateAuthToken } from "../utils/auth";
import { verifyHash } from "../utils/hash";

const prisma = new PrismaClient()

const loginBody = t.Object({
	email: t.String(),
  //.minLength(1),
	password: t.String()
  //.minLength(1)
})


const AuthModel = new Elysia()
    .model({
        'auth.login': loginBody
    })

const models = AuthModel.models





const app = new Elysia()
// .use(swagger())
.use(AuthModel)

.get("/", () => "Hello Elysia")
app.post('/login', (req) => checkGuest(req, async ()=>{
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return { status: 401, message: 'User not found' }
  }

  const isMatch = await verifyHash(password, user.password)
  if (!isMatch) {
    return { status: 401, message: 'Invalid credentials' }
  }

  const token = generateAuthToken(user.id)

  return { message: 'Login successful', token }

}), 
{
  body: 'auth.login'
}
)

.get('/user/:id', ({ params: { id } }) => id, {
  params: t.Object({
      id: t.Numeric()
  })
})
// .get("/register")
// .update("/promote-author-to-user/:id")
// .update("/demore-author-to-user/:id")
.listen(3000);





/**
 * ? for testig
 * export type App = typeof app;
 */