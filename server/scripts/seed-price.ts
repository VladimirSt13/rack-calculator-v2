/**
 * Script to initialize test price data
 * Usage: npx tsx scripts/seed-price.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const rackPriceData = {
  supports: {
    '215': {
      edge: {
        code: '215',
        name: '215',
        price: 600,
        weight: 2.0,
        category: 'supports',
      },
      intermediate: {
        code: '215',
        name: '215',
        price: 620,
        weight: 2.05,
        category: 'supports',
      },
    },
    '290': {
      edge: {
        code: '290',
        name: '290',
        price: 780,
        weight: 2.6,
        category: 'supports',
      },
      intermediate: {
        code: '290',
        name: '290',
        price: 800,
        weight: 2.65,
        category: 'supports',
      },
    },
    '430': {
      edge: {
        code: '430',
        name: '430',
        price: 930,
        weight: 3.27,
        category: 'supports',
      },
      intermediate: {
        code: '430',
        name: '430',
        price: 980,
        weight: 3.33,
        category: 'supports',
      },
    },
    '580': {
      edge: {
        code: '580',
        name: '580',
        price: 1020,
        weight: 3.9,
        category: 'supports',
      },
      intermediate: {
        code: '580',
        name: '580',
        price: 1070,
        weight: 3.96,
        category: 'supports',
      },
    },
    '645': {
      edge: {
        code: '645',
        name: '645',
        price: 1240,
        weight: 4.3,
        category: 'supports',
      },
      intermediate: {
        code: '645',
        name: '645',
        price: 1290,
        weight: 4.36,
        category: 'supports',
      },
    },
    '860': {
      edge: {
        code: '860',
        name: '860',
        price: 1480,
        weight: 5.1,
        category: 'supports',
      },
      intermediate: {
        code: '860',
        name: '860',
        price: 1530,
        weight: 5.16,
        category: 'supports',
      },
    },
    '1190': {
      edge: {
        code: '1190',
        name: '1190',
        price: 1850,
        weight: 6.2,
        category: 'supports',
      },
      intermediate: {
        code: '1190',
        name: '1190',
        price: 1900,
        weight: 6.26,
        category: 'supports',
      },
    },
    '430C': {
      edge: {
        code: '430C',
        name: '430C',
        price: 1100,
        weight: 3.5,
        category: 'supports',
      },
      intermediate: {
        code: '430C',
        name: '430C',
        price: 1150,
        weight: 3.56,
        category: 'supports',
      },
    },
    '580C': {
      edge: {
        code: '580C',
        name: '580C',
        price: 1300,
        weight: 4.2,
        category: 'supports',
      },
      intermediate: {
        code: '580C',
        name: '580C',
        price: 1350,
        weight: 4.26,
        category: 'supports',
      },
    },
    '645C': {
      edge: {
        code: '645C',
        name: '645C',
        price: 1520,
        weight: 4.6,
        category: 'supports',
      },
      intermediate: {
        code: '645C',
        name: '645C',
        price: 1570,
        weight: 4.66,
        category: 'supports',
      },
    },
  },
  spans: {
    '600': {
      code: '600',
      name: '600',
      price: 500,
      weight: 1.6,
      category: 'spans',
    },
    '750': {
      code: '750',
      name: '750',
      price: 630,
      weight: 2.1,
      category: 'spans',
    },
    '900': {
      code: '900',
      name: '900',
      price: 730,
      weight: 2.56,
      category: 'spans',
    },
    '1000': {
      code: '1000',
      name: '1000',
      price: 790,
      weight: 2.83,
      category: 'spans',
    },
    '1200': {
      code: '1200',
      name: '1200',
      price: 870,
      weight: 3.4,
      category: 'spans',
    },
    '1500': {
      code: '1500',
      name: '1500',
      price: 980,
      weight: 4.28,
      category: 'spans',
    },
    '2000': {
      code: '2000',
      name: '2000',
      price: 1930,
      weight: 5.7,
      category: 'spans',
    },
  },
  vertical_supports: {
    '632': {
      code: '632',
      name: '632',
      price: 630,
      weight: 1.8,
      category: 'vertical_supports',
    },
    '1190': {
      code: '1190',
      name: '1190',
      price: 1150,
      weight: 3.4,
      category: 'vertical_supports',
    },
    '1500': {
      code: '1500',
      name: '1500',
      price: 1450,
      weight: 4.3,
      category: 'vertical_supports',
    },
    '2000': {
      code: '2000',
      name: '2000',
      price: 1930,
      weight: 5.7,
      category: 'vertical_supports',
    },
  },
  diagonal_brace: {
    code: 'diagonal_brace',
    name: 'diagonal_brace',
    price: 380,
    weight: 1.0,
    category: 'diagonal_brace',
  },
  isolator: {
    code: 'isolator',
    name: 'isolator',
    price: 69,
    weight: 0.1,
    category: 'isolator',
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
  .catch((e) => {
    console.error('❌ Error seeding price data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
