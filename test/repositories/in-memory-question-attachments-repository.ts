import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  public items: QuestionAttachment[] = []

  async createMany(attachment: QuestionAttachment[]): Promise<void> {
    this.items.push(...attachment)
  }

  async deleteMany(attachment: QuestionAttachment[]): Promise<void> {
    this.items = this.items.filter((item) => {
      return !attachment.some((attachment) => attachment.equals(item)) // retorna apenas itens que não foram informados para deletar
    })
  }

  async findManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() === questionId,
    )

    return questionAttachments
  }

  async deleteManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    )

    this.items = questionAttachments
  }
}
