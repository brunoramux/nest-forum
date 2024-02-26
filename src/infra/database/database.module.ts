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
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answer-repository'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository'
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments-repository'
import { NotificationRespository } from '@/domain/notification/application/repositories/notification-repository'
import { PrismaNotificationRepository } from './prisma/repositories/prisma-notification-repository'
import { CacheModule } from '../cache/cache.module'

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    { provide: StudentsRepository, useClass: PrismaStudentsRepository },
    {
      provide: QuestionRepository,
      useClass: PrismaQuestionRepository,
    },
    {
      provide: QuestionAttachmentsRepository,
      useClass: PrismaQuestionAttachmentRepository,
    },
    {
      provide: QuestionCommentsRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    { provide: AnswersRepository, useClass: PrismaAnswerRepository },
    {
      provide: AnswerAttachmentsRepository,
      useClass: PrismaAnswerAttachmentsRepository,
    },
    {
      provide: AnswerCommentsRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
    { provide: AttachmentsRepository, useClass: PrismaAttachmentsRepository },
    {
      provide: NotificationRespository,
      useClass: PrismaNotificationRepository,
    },
  ],
  exports: [
    PrismaService,
    QuestionAttachmentsRepository,
    AnswerAttachmentsRepository,
    QuestionCommentsRepository,
    QuestionRepository,
    AnswersRepository,
    AnswerCommentsRepository,
    StudentsRepository,
    AttachmentsRepository,
    NotificationRespository,
  ], // faz com que possamos utilizar o PrismaServices no módulos que importar o DatabaseModule
})
export class DatabaseModule {}
