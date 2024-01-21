import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TokenSchema } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'

const commentQuestionBodySchema = z.object({
  content: z.string(),
})

type CommentQuestionBodySchema = z.infer<typeof commentQuestionBodySchema>

@Controller('/questions/:id/comments')
export class CommentOnQuestionController {
  constructor(private commentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: TokenSchema,
    @Body(new ZodValidationPipe(commentQuestionBodySchema))
    body: CommentQuestionBodySchema,
    @Param('id') questionId: string,
  ) {
    const { content } = body
    const { sub: userId } = user

    const result = await this.commentOnQuestion.execute({
      content,
      authorId: userId,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
