/**
 * Скрипт для створення тестового прайсу з новою структурою
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createTestPrice() {
  console.log('Creating test price...')

  // Видалимо старий запис
  await prisma.price.deleteMany({})
  console.log('Deleted old prices')

  // Створимо новий прайс
  const price = await prisma.price.create({
    data: {
      category: 'rack',
      name: 'Прайс стелажів 2024',
      isActive: true,
      items: [
        // Supports
        {
          id: 'support_215',
          type: 'support',
          size: '215',
          variants: [
            { id: 'support_215_edge', variant: 'edge', price: 600, weight: 2.0 },
            { id: 'support_215_intermediate', variant: 'intermediate', price: 620, weight: 2.05 },
          ],
        },
        {
          id: 'support_290',
          type: 'support',
          size: '290',
          variants: [
            { id: 'support_290_edge', variant: 'edge', price: 780, weight: 2.6 },
            { id: 'support_290_intermediate', variant: 'intermediate', price: 800, weight: 2.65 },
          ],
        },
        {
          id: 'support_430',
          type: 'support',
          size: '430',
          variants: [
            { id: 'support_430_edge', variant: 'edge', price: 930, weight: 3.27 },
            { id: 'support_430_intermediate', variant: 'intermediate', price: 980, weight: 3.33 },
          ],
        },
        {
          id: 'support_580',
          type: 'support',
          size: '580',
          variants: [
            { id: 'support_580_edge', variant: 'edge', price: 1020, weight: 3.9 },
            { id: 'support_580_intermediate', variant: 'intermediate', price: 1070, weight: 3.95 },
          ],
        },
        {
          id: 'support_645',
          type: 'support',
          size: '645',
          variants: [
            { id: 'support_645_edge', variant: 'edge', price: 1240, weight: 4.3 },
            { id: 'support_645_intermediate', variant: 'intermediate', price: 1290, weight: 4.35 },
          ],
        },
        {
          id: 'support_860',
          type: 'support',
          size: '860',
          variants: [
            { id: 'support_860_edge', variant: 'edge', price: 1480, weight: 5.7 },
            { id: 'support_860_intermediate', variant: 'intermediate', price: 1530, weight: 5.75 },
          ],
        },
        {
          id: 'support_1190',
          type: 'support',
          size: '1190',
          variants: [
            { id: 'support_1190_edge', variant: 'edge', price: 1850, weight: null },
            { id: 'support_1190_intermediate', variant: 'intermediate', price: 1900, weight: null },
          ],
        },
        {
          id: 'support_430C',
          type: 'support',
          size: '430C',
          variants: [
            { id: 'support_430C_edge', variant: 'edge', price: 1100, weight: 3.9 },
            { id: 'support_430C_intermediate', variant: 'intermediate', price: 1150, weight: 3.95 },
          ],
        },
        {
          id: 'support_580C',
          type: 'support',
          size: '580C',
          variants: [
            { id: 'support_580C_edge', variant: 'edge', price: 1300, weight: 4.65 },
            { id: 'support_580C_intermediate', variant: 'intermediate', price: 1350, weight: 4.7 },
          ],
        },
        {
          id: 'support_645C',
          type: 'support',
          size: '645C',
          variants: [
            { id: 'support_645C_edge', variant: 'edge', price: 1520, weight: null },
            { id: 'support_645C_intermediate', variant: 'intermediate', price: 1570, weight: null },
          ],
        },
        // Spans
        { id: 'span_600', type: 'span', size: '600', price: 500, weight: 1.6 },
        { id: 'span_750', type: 'span', size: '750', price: 630, weight: 2.1 },
        { id: 'span_900', type: 'span', size: '900', price: 730, weight: 2.56 },
        { id: 'span_1000', type: 'span', size: '1000', price: 790, weight: 2.83 },
        { id: 'span_1200', type: 'span', size: '1200', price: 870, weight: 3.4 },
        { id: 'span_1500', type: 'span', size: '1500', price: 980, weight: 4.28 },
        { id: 'span_2000', type: 'span', size: '2000', price: 1930, weight: 5.7 },
        // Vertical supports
        { id: 'vertical_support_632', type: 'vertical_support', size: '632', price: 630, weight: 1.8 },
        { id: 'vertical_support_1190', type: 'vertical_support', size: '1190', price: 1150, weight: 3.4 },
        { id: 'vertical_support_1500', type: 'vertical_support', size: '1500', price: 1450, weight: 4.3 },
        { id: 'vertical_support_2000', type: 'vertical_support', size: '2000', price: 1930, weight: 5.7 },
        // Diagonal brace
        { id: 'diagonal_brace', type: 'diagonal_brace', price: 380, weight: 1.0 },
        // Isolator
        { id: 'isolator', type: 'isolator', price: 69, weight: 0.1 },
      ],
    },
  })

  console.log(`✓ Created price with ${price.items.length} items`)
  console.log('\nTest price created successfully!')
  
  await prisma.$disconnect()
}

createTestPrice().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
