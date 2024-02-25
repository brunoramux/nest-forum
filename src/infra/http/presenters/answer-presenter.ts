import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class AnswerPresenter {
  static toHTTP(answer: Answer) {
    return {
      id: answer.id.toString(),
      content: answer.content,
      authorId: answer.authorId,
      questionId: answer.questionId,
      attachments: answer.attachments,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    }
  }
}
