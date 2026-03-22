import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkAdmin() {
  const user = await prisma.user.findUnique({
    where: { email: 'admin@accu-energo.com.ua' },
  })

  console.log('=== Admin User ===')
  console.log('ID:', user?.id)
  console.log('Email:', user?.email)
  console.log('RoleId:', user?.roleId)
  console.log('Role:', user?.role)
  console.log('==================')

  if (user?.roleId) {
    const role = await prisma.role.findUnique({
      where: { id: user.roleId },
    })
    console.log('Role from DB:', role)
  }

  await prisma.$disconnect()
}

checkAdmin()
