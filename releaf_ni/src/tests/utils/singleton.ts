import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

import prisma from '@/app/client'

// Mock the default export from the client file
jest.mock('@/app/client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}))

// Reset the mock before each test
beforeEach(() => {
  mockReset(prismaMock)
})

// Export the mocked Prisma Client
export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>