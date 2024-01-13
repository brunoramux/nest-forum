import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionRepository implements QuestionRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentRepository: QuestionAttachmentsRepository,
  ) {}

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)
    if (!question) {
      return null
    }
    return question
  }

  async create(question: Question) {
    this.items.push(question)
    DomainEvents.dispatchEventsForAggregate(question.id)
    return question
  }

  async findById(id: string): Promise<Question | null> {
    const question = this.items.find((item) => item.id.toString() === id)

    if (!question) {
      return null
    }
    return question
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) // ordena os itens do array
      /* se a comparação for menor que zero, a é posicionado antes de b
         se a comparação for maior que zero, a é posicionado depois de b
         se a comparação for igual a zero, a e b permanecem com as posições inalteradas */
      .slice((page - 1) * 20, page * 20) // cria paginacao

    return questions
  }

  async save(question: Question): Promise<void> {
    const questionIndex = this.items.findIndex(
      (item) => item.id === question.id,
    )
    DomainEvents.dispatchEventsForAggregate(question.id)

    this.items[questionIndex] = question
  }

  async delete(question: Question) {
    const questionIndex = this.items.findIndex(
      (item) => item.id === question.id,
    )

    this.items.splice(questionIndex, 1)

    this.questionAttachmentRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }
}
