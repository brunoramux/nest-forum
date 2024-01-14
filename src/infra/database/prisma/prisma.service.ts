import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['warn', 'error'],
    })
  }

  onModuleInit() {
    // chamado quando a classe for instanciada
    return this.$connect()
  }

  onModuleDestroy() {
    // chamado quando ha um erro
    return this.$disconnect()
  }
}
