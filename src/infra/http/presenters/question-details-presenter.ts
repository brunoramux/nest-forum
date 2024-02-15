import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { AttachmentPresenter } from './attachment-presenter'

export class QuestionDetailsPresenter {
  static toHTTP(QuestionDetails: QuestionDetails) {
    return {
      questionId: QuestionDetails.questionId.toString(),
      authorId: QuestionDetails.authorId.toString(),
      author: QuestionDetails.author,
      content: QuestionDetails.content,
      title: QuestionDetails.title,
      slug: QuestionDetails.slug.value,
      bestAnswerId: QuestionDetails.bestAnswerId?.toString(),
      createdAt: QuestionDetails.createdAt,
      updatedAt: QuestionDetails.updatedAt,
      attachments: QuestionDetails.attachments.map(AttachmentPresenter.toHTTP),
    }
  }
}
