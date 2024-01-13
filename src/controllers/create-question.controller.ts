import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { TokenSchema } from 'src/auth/jwt.strategy'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>
@Controller('/questions')
@UseGuards(JwtAuthGuard) // Rota autenticada
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @CurrentUser() user: TokenSchema,
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBodySchema,
  ) {
    const { content, title } = body
    const { sub: userId } = user
    const slug = this.createFromText(title)

    await this.prisma.question.create({
      data: {
        content,
        title,
        slug,
        authorId: userId,
      },
    })
  }

  private createFromText(text: string) {
    const slugText = text
      .normalize('NFKD')
      .toLowerCase() // minusculo
      .trim() // tira espaços
      .replace(/\s+/g, '-') // s = whitespace. Substitui espaços em branco por string vazia
      .replace(/[^\w-]+/g, '') // \w = todas as palavras, + = um ou mais vezes. O que não são palavras serão substituidos por string vazia. g = global
      .replace(/_/g, '-') // remove underline e substitui por hífen
      .replace(/--+/g, '-') // tira lugares onde aparecem dois hífens e troca por um só
      .replace(/-$/g, '') // $ = final da string. Substitui hifem do final por string vazio

    return slugText
  }
}
