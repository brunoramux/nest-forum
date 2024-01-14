import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaQuestionAttachmentRepository } from './prisma/repositories/prisma-question-attachments-repository'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository'
import { PrismaQuestionRepository } from './prisma/repositories/prisma-question-repository'
import { PrismaAnswerRepository } from './prisma/repositories/prisma-answer-repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments-repository'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'

@Module({
  providers: [
    PrismaService,
    PrismaQuestionAttachmentRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    {
      provide: QuestionRepository,
      useClass: PrismaQuestionRepository,
    },
    PrismaAnswerRepository,
    PrismaAnswerCommentsRepository,
  ],
  exports: [
    PrismaService,
    PrismaQuestionAttachmentRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    QuestionRepository,
    PrismaAnswerRepository,
    PrismaAnswerCommentsRepository,
  ], // faz com que possamos utilizar o PrismaServices no módulos que importar o DatabaseModule
})
export class DatabaseModule {}
