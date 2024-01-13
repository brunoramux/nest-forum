import { Either, left, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionRepository } from '../repositories/question-repository'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'

interface FetchRecentQuestionUseCaseRequest {
  page: number
}
type FetchRecentQuestionUseCaseResponse = Either<
  ResourceNotFoundError,
  { questions: Question[] }
> // Either<L, R> onde L sao os possiveis erros e R e o retorno de sucesso{

export class FetchRecentQuestionsUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionUseCaseRequest): Promise<FetchRecentQuestionUseCaseResponse> {
    const questions = await this.questionRepository.findManyRecent({ page })

    if (!questions) {
      return left(new ResourceNotFoundError())
    }

    return right({
      questions,
    })
  }
}
