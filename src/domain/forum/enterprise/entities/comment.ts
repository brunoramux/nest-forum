/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface CommentProps {
  authorId: UniqueEntityId
  content: string
  createdAt: Date
  updatedAt?: Date | null
}
export abstract class Comment<
  Props extends CommentProps, // permite que possamos adicionar itens dentro da tipagem via classe pai
> extends AggregateRoot<Props> {
  // envio da tipagem para a classe pai
  get content() {
    return this.props.content
  }

  get authorId() {
    return this.props.authorId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }
}
