import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function assignAdminRole() {
  try {
    // Знайти або створити роль ADMIN
    let adminRole = await prisma.role.findUnique({
      where: { name: 'ADMIN' },
    })

    if (!adminRole) {
      adminRole = await prisma.role.create({
        data: {
          name: 'ADMIN',
          description: 'Адміністратор системи',
        },
      })
      console.log('✅ Роль ADMIN створено:', adminRole.id)
    } else {
      console.log('✅ Роль ADMIN знайдено:', adminRole.id)
    }

    // Знайти користувача admin@accu-energo.com.ua
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@accu-energo.com.ua' },
    })

    if (!adminUser) {
      console.error('❌ Користувача admin@accu-energo.com.ua не знайдено')
      return
    }

    // Присвоїти роль користувачу
    await prisma.user.update({
      where: { id: adminUser.id },
      data: { roleId: adminRole.id },
    })

    console.log('✅ Роль ADMIN присвоєно користувачу:', adminUser.email)
    console.log('   User ID:', adminUser.id)
    console.log('   Role ID:', adminRole.id)
  } catch (error) {
    console.error('❌ Помилка:', error)
  } finally {
    await prisma.$disconnect()
  }
}

assignAdminRole()
