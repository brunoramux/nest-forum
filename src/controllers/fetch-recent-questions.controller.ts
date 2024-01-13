import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema) // Nova PIPE de validacao Zod com schema de parametros da rota

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    // informo a PIPE para validação dos Query Params
    const perPage = 20
    const questions = await this.prisma.question.findMany({
      take: perPage, // quantidade de registros por pagina
      skip: (page - 1) * perPage, // quantos pulos deve dar de acordo com a pagina passada via parametros
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { questions }
  }
}
