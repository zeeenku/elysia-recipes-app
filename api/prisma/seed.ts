import { PrismaClient, UserRole } from '@prisma/client'
import { hashString } from '../utils/hash'

const prisma = new PrismaClient()

async function main() {

    const user = await prisma.user.create({
    data: {
    name: 'Zakariaa Enajjachi',
    email: 'enajjachi.zakariaa@gmail.com',
    role: UserRole.admin,
    password: await hashString("12345678"),
    },
})

console.log('User created:', user)
}

main()
.catch(e => {
    console.error(e)
    process.exit(1)
})
.finally(async () => {
    await prisma.$disconnect()
})
