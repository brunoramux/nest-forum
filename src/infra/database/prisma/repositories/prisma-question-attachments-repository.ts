import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionAttachmentMapper } from '../mappers/prisma-question-attachment-mapper'

@Injectable()
export class PrismaQuestionAttachmentRepository
  implements QuestionAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async createMany(attachment: QuestionAttachment[]): Promise<void> {
    if (attachment.length === 0) {
      return
    }

    const attachmentsId = attachment.map((attachment) => {
      return attachment.attachmentId.toString()
    })

    await this.prisma.attachment.updateMany({
      where: {
        id: {
          in: attachmentsId,
        },
      },
      data: {
        questionId: attachment[0].questionId.toString(),
      },
    })
  }

  async deleteMany(attachment: QuestionAttachment[]): Promise<void> {
    if (attachment.length === 0) {
      return
    }

    const attachmentsId = attachment.map((attachment) => {
      return attachment.id.toString()
    })
    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentsId,
        },
      },
    })
  }

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const questionAttachments = await this.prisma.attachment.findMany({
      where: {
        questionId,
      },
    })

    return questionAttachments.map(PrismaQuestionAttachmentMapper.toDomain)
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        questionId,
      },
    })
  }
}
