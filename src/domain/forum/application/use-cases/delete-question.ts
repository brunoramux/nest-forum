/* eslint-disable @typescript-eslint/ban-types */
import { Either, left, right } from '@/core/either'
import { QuestionRepository } from '../repositories/question-repository'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'

interface DeleteQuestionUseCaseRequest {
  authorId: string
  questionId: string
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
type DeleteQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
> // Either<L, R> onde L sao os possiveis erros e R e o retorno de sucesso{

export class DeleteQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    authorId,
    questionId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (question?.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    await this.questionRepository.delete(question)

    return right({})
  }
}
