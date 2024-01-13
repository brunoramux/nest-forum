import { PaginationParams } from '@/core/repositories/pagination-params'
import { Answer } from '../../enterprise/entities/answer'

export interface AnswersRepository {
  findById(id: string): Promise<Answer | null>
  create(answer: Answer): Promise<Answer>
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]>
  save(question: Answer): Promise<void>
  delete(answer: Answer): Promise<void>
}
