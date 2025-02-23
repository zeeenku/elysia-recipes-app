import { Elysia, t } from "elysia";
import { PrismaClient, UserRole } from '@prisma/client'
import { checkAuthorization, checkGuest, generateAuthToken } from "../utils/middlewares";
import { hashString, verifyHash } from "../utils/hash";

const prisma = new PrismaClient()

const loginBody = t.Object({
	email: t.String({
    format: 'email'
}),
	password: t.String({
    minLength : 8
  })
})


const registerBody = t.Object({
	email: t.String({
    format: 'email'
  }),
  name: t.String({
    minLength : 1
  }),
	password: t.String({
    minLength : 8
  })
})

const updateUserRoleParam = t.Object({
  id: t.Number()
})
const AuthModel = new Elysia()
    .model({
        'auth.login': loginBody,
        'auth.register': registerBody,
        'auth.update-role':updateUserRoleParam
    })



export const authRouter = new Elysia()
.use(AuthModel)

.post('/register', (req) => checkGuest(req, async ()=>{
  const { name, email, password } = req.body
  const hashedPassword = await hashString(password)

  const userExists = await prisma.user.findUnique({ where: { email } })
  if (userExists) {
    return { status: 401, message: 'a User already exists with this email' }
  }
  
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role: UserRole.user },
  })

  const token = generateAuthToken(user.id)

  return { message: 'User created successfully', user, token }
}),
{
  body: 'auth.register'
})


.post('/login', (req) => checkGuest(req, async ()=>{
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



.patch("/promote-user-to-author/:id", (req) => 
  checkAuthorization(req, UserRole.admin, async (req)=>{
  const {id} = req;
  const updatedUser = await prisma.user.update({
    where: { id: Number(id) },
    data: { role : UserRole.author},
  })
  return { message: 'User updated successfully', user: updatedUser }
}), {
  params: updateUserRoleParam
}
)


.patch("/demote-author-to-user/:id", (req) => 
  checkAuthorization(req, UserRole.admin, async (req)=>{
  const {id} = req;
  const updatedUser = await prisma.user.update({
    where: { id: Number(id) },
    data: { role : UserRole.user},
  })
  return { message: 'User updated successfully', user: updatedUser }
}), {
  params: updateUserRoleParam
}
)