import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const connectionString = "postgresql://postgres.usqtfymjbwrkyvfttrbc:d5ExmbRgh1Hemj47@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
