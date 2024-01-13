/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { Slug } from './value-objects/slug'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import dayjs from 'dayjs'
import { QuestionAttachmentList } from './question-attachment-list'
import { QuestionBestAnswerChosenEvent } from '../events/question-best-answer-chosen-event'

export interface QuestionProps {
  title: string
  content: string
  slug: Slug
  authorId: UniqueEntityId
  bestAnswerId?: UniqueEntityId
  createdAt: Date
  updatedAt?: Date
  attachments: QuestionAttachmentList
}
export class Question extends AggregateRoot<QuestionProps> {
  // envio a tipagem para a classe pai
  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get slug() {
    return this.props.slug
  }

  get authorId() {
    return this.props.authorId
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
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

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, 'days') <= 3
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)
    this.touch()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  set bestAnswerId(bestAnswerId: UniqueEntityId | undefined) {
    if (bestAnswerId && bestAnswerId !== this.props.bestAnswerId) {
      // verifica se bestAnswerId foi enviado e se ela já não era a melhor resposta cadastrada anteriormente
      this.addDomainEvent(new QuestionBestAnswerChosenEvent(this, bestAnswerId))
    }
    this.props.bestAnswerId = bestAnswerId
    this.touch()
  }

  set attachaments(attachament: QuestionAttachmentList) {
    this.props.attachments = attachament
  }

  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>, // Forma de tornar propriedades opcionais dentro de um tipo especifico.
    id?: UniqueEntityId,
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title), // caso slug nao venha nas propriedades, ele e criado atraves do metodo createFrom Text
        attachments: props.attachments ?? new QuestionAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
    // tenho acesso ao construtor protected pois estou dentro da classe que extende a classe Entity
    return question
  }
}
