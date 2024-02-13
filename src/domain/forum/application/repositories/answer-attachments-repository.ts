import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'

export abstract class AnswerAttachmentsRepository {
  abstract createMany(attachment: AnswerAttachment[]): Promise<void>
  abstract deleteMany(attachment: AnswerAttachment[]): Promise<void>
  abstract findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>
  abstract deleteManyByAnswerId(answerId: string): Promise<void>
}
