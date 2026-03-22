import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function assignAdminRole() {
  try {
    // Найти или создать роль ADMIN
    let adminRole = await prisma.role.findUnique({
      where: { name: 'ADMIN' },
    })

    if (!adminRole) {
      adminRole = await prisma.role.create({
        data: {
          name: 'ADMIN',
          description: 'Администратор системы',
        },
      })
      console.log('✅ Роль ADMIN создана:', adminRole.id)
    } else {
      console.log('✅ Роль ADMIN найдена:', adminRole.id)
    }

    // Найти пользователя admin@accu-energo.com.ua
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@accu-energo.com.ua' },
    })

    if (!adminUser) {
      console.error('❌ Пользователь admin@accu-energo.com.ua не найден')
      return
    }

    // Присвоить роль пользователю
    await prisma.user.update({
      where: { id: adminUser.id },
      data: { roleId: adminRole.id },
    })

    console.log('✅ Роль ADMIN присвоена пользователю:', adminUser.email)
    console.log('   User ID:', adminUser.id)
    console.log('   Role ID:', adminRole.id)
  } catch (error) {
    console.error('❌ Ошибка:', error)
  } finally {
    await prisma.$disconnect()
  }
}

assignAdminRole()
