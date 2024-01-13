/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Comment, CommentProps } from './comment'

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityId
}
export class AnswerComment extends Comment<AnswerCommentProps> {
  get answerId() {
    return this.props.answerId
  }

  static create(
    props: Optional<AnswerCommentProps, 'createdAt'>, // Forma de tornar propriedades opcionais dentro de um tipo especifico. Caso contrario eu seria obrigado a enviar o createdAt
    id?: UniqueEntityId,
  ) {
    const answerComment = new AnswerComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
    // tenho acesso ao construtor protected pois estou dentro da classe que extende a classe Entity
    return answerComment
  }
}
