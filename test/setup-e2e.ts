import { DomainEvents } from '@/core/events/domain-events'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import { randomUUID } from 'crypto'
import 'dotenv/config'

const prisma = new PrismaClient()

function generateUniqueDatabaseUrl(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable')
  }
  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schemaId)

  return url.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseUrl(schemaId)

  process.env.DATABASE_URL = databaseURL // sobrescrevo a variavel ambiente de conexao do banco de dados para que as operacoes sejam executas dentro de outro schema e não afete o banco 'real'

  DomainEvents.shouldRun = false
  // execSync('npx prisma migrate reset')

  execSync('npx prisma migrate deploy') // gera mas migrations e atualiza o banco de dados.
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})
