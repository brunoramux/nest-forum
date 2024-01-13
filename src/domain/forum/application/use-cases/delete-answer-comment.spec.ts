import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Question Comment', () => {
  beforeEach(async () => {
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentRepository)
  })

  it('It should be able to delete a question comment', async () => {
    const newAnswerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('answer-comment-1'),
    )
    await inMemoryAnswerCommentRepository.create(newAnswerComment)

    await sut.execute({
      answerCommentId: 'answer-comment-1',
      authorId: 'author-1',
    })

    expect(inMemoryAnswerCommentRepository.items).toHaveLength(0)
  })

  it('It should not be able to delete a answer comment from other authors', async () => {
    const newAnswerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-comment-1'),
    )
    await inMemoryAnswerCommentRepository.create(newAnswerComment)

    const result = await sut.execute({
      answerCommentId: 'question-comment-1',
      authorId: 'author-2',
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
