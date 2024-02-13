import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerAttachmentMapper } from '../mappers/prisma-answer-attachment-mapper'

@Injectable()
export class PrismaAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async createMany(attachment: AnswerAttachment[]): Promise<void> {
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
        answerId: attachment[0].answerId.toString(),
      },
    })
  }

  async deleteMany(attachment: AnswerAttachment[]): Promise<void> {
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

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const answerAttachments = await this.prisma.attachment.findMany({
      where: {
        answerId,
      },
    })

    return answerAttachments.map(PrismaAnswerAttachmentMapper.toDomain)
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        answerId,
      },
    })
  }
}
