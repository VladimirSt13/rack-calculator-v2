/**
 * Script to initialize test price data
 * Usage: npx tsx scripts/seed-price.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const rackPriceData = {
  supports: {
    '215 кр': {
      code: '215',
      name: 'Крайня опора 1-рядного стелажа, 215мм',
      price: 600,
      weight: 2.0,
      category: 'supports',
    },
    '215 пром': {
      code: '215',
      name: 'Проміжна опора 1-рядного стелажа, 215мм',
      price: 620,
      weight: 2.05,
      category: 'supports',
    },
    '430 кр': {
      code: '430',
      name: 'Крайня опора 2-рядного стелажа, 430мм',
      price: 930,
      weight: 3.27,
      category: 'supports',
    },
    '430 пром': {
      code: '430',
      name: 'Проміжна опора 2-рядного стелажа, 430мм',
      price: 980,
      weight: 3.33,
      category: 'supports',
    },
    '580 кр': {
      code: '580',
      name: 'Крайня опора 2-рядного стелажа, 580мм',
      price: 1020,
      weight: 3.9,
      category: 'supports',
    },
    '645 кр': {
      code: '645',
      name: 'Крайня опора 2-рядного стелажа, 645мм',
      price: 1240,
      weight: 4.3,
      category: 'supports',
    },
  },
  spans: {
    '600': {
      code: '600',
      name: 'Траверса, h/с-профіль, 600мм',
      price: 500,
      weight: 1.6,
      category: 'spans',
    },
    '750': {
      code: '750',
      name: 'Траверса, h/с-профіль, 750мм',
      price: 630,
      weight: 2.1,
      category: 'spans',
    },
    '900': {
      code: '900',
      name: 'Траверса, h/с-профіль, 900мм',
      price: 730,
      weight: 2.56,
      category: 'spans',
    },
    '1000': {
      code: '1000',
      name: 'Траверса, h/с-профіль, 1000мм',
      price: 790,
      weight: 2.83,
      category: 'spans',
    },
    '1200': {
      code: '1200',
      name: 'Траверса, h/с-профіль, 1200мм',
      price: 870,
      weight: 3.4,
      category: 'spans',
    },
    '1500': {
      code: '1500',
      name: 'Траверса, h/с-профіль, 1500мм',
      price: 980,
      weight: 4.28,
      category: 'spans',
    },
    '2000': {
      code: '2000',
      name: 'Траверса, h/с-профіль, 2000мм',
      price: 1930,
      weight: 5.7,
      category: 'spans',
    },
  },
  vertical_supports: {
    '632': {
      code: '632',
      name: 'Вертикальна опора, 632мм',
      price: 630,
      weight: 1.8,
      category: 'vertical_supports',
    },
    '1190': {
      code: '1190',
      name: 'Вертикальна опора, 1190мм',
      price: 1150,
      weight: 3.4,
      category: 'vertical_supports',
    },
    '1500': {
      code: '1500',
      name: 'Вертикальна опора, 1500мм',
      price: 1450,
      weight: 4.3,
      category: 'vertical_supports',
    },
    '2000': {
      code: '2000',
      name: 'Вертикальна опора, 2000мм',
      price: 1930,
      weight: 5.7,
      category: 'vertical_supports',
    },
  },
  diagonal_brace: {
    diagonal_brace: {
      code: 'diagonal_brace',
      name: 'Розкос багатоповерхового стелажа',
      price: 380,
      weight: 1.0,
      category: 'diagonal_brace',
    },
  },
  isolator: {
    isolator: {
      code: 'isolator',
      name: 'Ізолятор опори одноповерхового стелажа',
      price: 69,
      weight: 0.1,
      category: 'isolator',
    },
  },
}

async function main() {
  console.log('🌱 Seeding price data...')

  // Check if price already exists
  const existingPrice = await prisma.price.findFirst({
    where: { category: 'rack' },
  })

  if (existingPrice) {
    console.log('⚠️  Price list for "rack" already exists. Skipping...')
    return
  }

  // Create price list
  const price = await prisma.price.create({
    data: {
      category: 'rack',
      data: rackPriceData,
      isActive: true,
    },
  })

  console.log('✅ Price list created:', price.id)
  console.log('📦 Category:', price.category)
  console.log('📊 Components:', Object.keys(rackPriceData).join(', '))
}

main()
  .catch(e => {
    console.error('❌ Error seeding price data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
