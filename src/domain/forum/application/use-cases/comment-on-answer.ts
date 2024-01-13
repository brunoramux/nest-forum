import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '../../enterprise/entities/answer-comments'
import { AnswersRepository } from '../repositories/answer-repository'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'
import { Either, left, right } from '@/core/either'

interface CommentOnAnswerUseCaseRequest {
  authorId: string
  content: string
  answerId: string
}

type CommentOnAnswerUseCaseResponse = Either<
  ResourceNotFoundError,
  { comment: AnswerComment }
> // Either<L, R> onde L sao os possiveis erros e R e o retorno de sucesso{

export class CommentOnAnswerUseCase {
  constructor(
    private answerRepository: AnswersRepository,
    private answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({
    authorId,
    content,
    answerId,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const comment = AnswerComment.create({
      authorId: new UniqueEntityId(authorId),
      content,
      answerId: new UniqueEntityId(answerId),
    })

    await this.answerCommentsRepository.create(comment)

    return right({ comment })
  }
}
