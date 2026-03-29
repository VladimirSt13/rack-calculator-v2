import { PrismaClient } from '@prisma/client'
import { PriceRepository } from './src/modules/price/infrastructure/price.repository.js'
import { BulkUpdatePricesUseCase } from './src/modules/price/application/use-cases/bulk-update-prices.use-case.js'

const prisma = new PrismaClient()
const priceRepository = new PriceRepository(prisma)
const useCase = new BulkUpdatePricesUseCase(priceRepository)

async function test() {
  console.log('Testing bulk update...')
  
  const priceId = '69c6fc2822fee1b9387ec840'
  const items = [
    { itemId: 'support_215', variantId: 'support_215_edge', price: 650 }
  ]
  
  try {
    const result = await useCase.execute({ priceId, items })
    console.log('Result:', result)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

test()
