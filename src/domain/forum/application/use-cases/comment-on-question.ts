import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionComment } from '../../enterprise/entities/question-comments'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { QuestionRepository } from '../repositories/question-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'

interface CommentOnQuestionUseCaseRequest {
  authorId: string
  content: string
  questionId: string
}

type CommentOnQuestionUseCaseResponse = Either<
  ResourceNotFoundError,
  { comment: QuestionComment }
> // Either<L, R> onde L sao os possiveis erros e R e o retorno de sucesso{

export class CommentOnQuestionUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({
    authorId,
    content,
    questionId,
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    const comment = QuestionComment.create({
      authorId: new UniqueEntityId(authorId),
      content,
      questionId: new UniqueEntityId(questionId),
    })

    await this.questionCommentsRepository.create(comment)

    return right({ comment })
  }
}
