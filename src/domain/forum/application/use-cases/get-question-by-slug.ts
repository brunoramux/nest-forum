import { Either, left, right } from '@/core/either'
import { QuestionRepository } from '../repositories/question-repository'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { QuestionDetails } from '../../enterprise/entities/value-objects/question-details'

interface GetQuestionBySlugUseCaseRequest {
  slug: string
}
type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  { question: QuestionDetails }
> // Either<L, R> onde L sao os possiveis erros e R e o retorno de sucesso{

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionRepository.findBySlugWithDetails(slug)

    if (!question) {
      return left(new ResourceNotFoundError())
    }
    return right({
      question,
    })
  }
}
