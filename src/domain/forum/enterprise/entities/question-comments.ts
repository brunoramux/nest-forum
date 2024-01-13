/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Comment, CommentProps } from './comment'
import { QuestionCommentEvent } from '../events/question-comment-event'

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityId
}
export class QuestionComment extends Comment<QuestionCommentProps> {
  get questionId() {
    return this.props.questionId
  }

  static create(
    props: Optional<QuestionCommentProps, 'createdAt'>, // Forma de tornar propriedades opcionais dentro de um tipo especifico. Caso contrario eu seria obrigado a enviar o createdAt
    id?: UniqueEntityId,
  ) {
    const questionComment = new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
    // tenho acesso ao construtor protected pois estou dentro da classe que extende a classe Entity
    questionComment.addDomainEvent(new QuestionCommentEvent(questionComment))
    return questionComment
  }
}
