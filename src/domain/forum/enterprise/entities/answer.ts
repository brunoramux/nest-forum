/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { AnswerAttachmentList } from './answer-attachment-list'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { AnswerCreatedEvent } from '../events/answer-created-event'

export interface AnswerProps {
  content: string
  authorId: UniqueEntityId
  questionId: UniqueEntityId
  createdAt: Date
  updatedAt?: Date
  attachments: AnswerAttachmentList
}
export class Answer extends AggregateRoot<AnswerProps> {
  // envio da tipagem para a classe pai
  get content() {
    return this.props.content
  }

  get authorId() {
    return this.props.authorId
  }

  get questionId() {
    return this.props.questionId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get attachaments() {
    return this.props.attachments
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  set attachaments(attachament: AnswerAttachmentList) {
    this.props.attachments = attachament
  }

  static create(
    props: Optional<AnswerProps, 'createdAt' | 'attachments'>, // Forma de tornar propriedades opcionais dentro de um tipo especifico. Caso contrario eu seria obrigado a enviar o createdAt
    id?: UniqueEntityId,
  ) {
    const answer = new Answer(
      {
        ...props,
        attachments: props.attachments ?? new AnswerAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
    // tenho acesso ao construtor protected pois estou dentro da classe que extende a classe Entity

    const isNewAnswer = !id

    if (isNewAnswer) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer))
    }
    return answer
  }
}
