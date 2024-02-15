import { Either, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionRepository } from '../repositories/question-repository'
import { Injectable } from '@nestjs/common'

interface FetchRecentQuestionUseCaseRequest {
  page: number
}
type FetchRecentQuestionUseCaseResponse = Either<
  null,
  { questions: Question[] }
> // Either<L, R> onde L sao os possiveis erros e R e o retorno de sucesso{

@Injectable()
export class FetchRecentQuestionsUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionUseCaseRequest): Promise<FetchRecentQuestionUseCaseResponse> {
    const questions = await this.questionRepository.findManyRecent({ page })

    return right({
      questions,
    })
  }
}
