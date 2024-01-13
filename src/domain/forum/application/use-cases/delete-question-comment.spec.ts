import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
  beforeEach(async () => {
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentRepository)
  })

  it('It should be able to delete a question comment', async () => {
    const newQuestionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-comment-1'),
    )
    await inMemoryQuestionCommentRepository.create(newQuestionComment)

    const result = await sut.execute({
      questionCommentId: 'question-comment-1',
      authorId: 'author-1',
    })

    expect(result.isRight()).toBe(true)
  })

  it('It should not be able to delete a question comment from other authors', async () => {
    const newQuestionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-comment-1'),
    )
    await inMemoryQuestionCommentRepository.create(newQuestionComment)

    const result = await sut.execute({
      questionCommentId: 'question-comment-1',
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
