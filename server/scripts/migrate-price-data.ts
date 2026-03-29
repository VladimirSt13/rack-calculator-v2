/**
 * Скрипт для міграції старих даних Price в нову структуру
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migratePriceData() {
  console.log('Starting price data migration...')

  // Отримуємо всі записи
  const prices = await prisma.price.findMany()

  console.log(`Found ${prices.length} prices`)

  for (const price of prices) {
    console.log(`\nMigrating price: ${price.id} (${price.category})`)

    // Спробуємо отримати старі дані з поля data
    const oldData = (price as any).data as any

    if (!oldData || typeof oldData !== 'object') {
      console.log('  Skipping - no data found')
      continue
    }

    const newItems: any[] = []

    // Міграція supports
    if (oldData.supports && typeof oldData.supports === 'object') {
      console.log('  Migrating supports...')

      for (const [size, supportData] of Object.entries(oldData.supports)) {
        const support: any = {
          id: `support_${size}`,
          type: 'support',
          size,
          variants: [],
        }

        const supportDataObj = supportData as any

        // Edge variant
        if (supportDataObj.edge) {
          support.variants.push({
            id: `support_${size}_edge`,
            variant: 'edge',
            price: supportDataObj.edge.price,
            weight: supportDataObj.edge.weight,
          })
        }

        // Intermediate variant
        if (supportDataObj.intermediate) {
          support.variants.push({
            id: `support_${size}_intermediate`,
            variant: 'intermediate',
            price: supportDataObj.intermediate.price,
            weight: supportDataObj.intermediate.weight,
          })
        }

        if (support.variants.length > 0) {
          newItems.push(support)
        }
      }
    }

    // Міграція spans
    if (oldData.spans && typeof oldData.spans === 'object') {
      console.log('  Migrating spans...')

      for (const [size, spanData] of Object.entries(oldData.spans)) {
        const span = spanData as any
        newItems.push({
          id: `span_${size}`,
          type: 'span',
          size,
          price: span.price,
          weight: span.weight,
        })
      }
    }

    // Міграція vertical_supports
    if (oldData.vertical_supports && typeof oldData.vertical_supports === 'object') {
      console.log('  Migrating vertical_supports...')

      for (const [size, vsData] of Object.entries(oldData.vertical_supports)) {
        const vs = vsData as any
        newItems.push({
          id: `vertical_support_${size}`,
          type: 'vertical_support',
          size,
          price: vs.price,
          weight: vs.weight,
        })
      }
    }

    // Міграція diagonal_brace
    if (oldData.diagonal_brace && typeof oldData.diagonal_brace === 'object') {
      console.log('  Migrating diagonal_brace...')
      const brace = oldData.diagonal_brace as any
      newItems.push({
        id: 'diagonal_brace',
        type: 'diagonal_brace',
        price: brace.price,
        weight: brace.weight,
      })
    }

    // Міграція isolator
    if (oldData.isolator && typeof oldData.isolator === 'object') {
      console.log('  Migrating isolator...')
      const isolator = oldData.isolator as any
      newItems.push({
        id: 'isolator',
        type: 'isolator',
        price: isolator.price,
        weight: isolator.weight,
      })
    }

    console.log(`  Created ${newItems.length} items`)

    // Оновлення запису в БД
    await prisma.price.update({
      where: { id: price.id },
      data: {
        items: newItems,
        name: price.name || `${price.category} price list`,
      },
    })

    console.log(`  ✓ Updated`)
  }

  console.log('\nMigration completed!')
  await prisma.$disconnect()
}

migratePriceData().catch((error) => {
  console.error('Migration error:', error)
  process.exit(1)
})
