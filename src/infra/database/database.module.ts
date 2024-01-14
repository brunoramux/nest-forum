import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaQuestionAttachmentRepository } from './prisma/repositories/prisma-question-attachments-repository'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository'
import { PrismaQuestionRepository } from './prisma/repositories/prisma-question-repository'
import { PrismaAnswerRepository } from './prisma/repositories/prisma-answer-repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments-repository'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students-repository'

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
    { provide: StudentsRepository, useClass: PrismaStudentsRepository },
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
    StudentsRepository,
  ], // faz com que possamos utilizar o PrismaServices no módulos que importar o DatabaseModule
})
export class DatabaseModule {}
