import { DomainEvent } from '@/core/events/domain-event'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionComment } from '../entities/question-comments'

export class QuestionCommentEvent implements DomainEvent {
  public ocurredAt: Date
  public questionComment: QuestionComment

  constructor(questionComment: QuestionComment) {
    this.questionComment = questionComment
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.questionComment.id
  }
}
