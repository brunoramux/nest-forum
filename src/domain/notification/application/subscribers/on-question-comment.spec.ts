/* eslint-disable no-new */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-questions-repository'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequestProps,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository'
import { SpyInstance } from 'vitest'
import { waitFor } from 'test/utils/wait-for'
import { OnQuestionComment } from './on-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionRepository
let inMemoryNotificationRepository: InMemoryNotificationRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sendNotificationUseCase: SendNotificationUseCase
let inMemoryQuestionCommentRepository: InMemoryQuestionCommentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequestProps],
  Promise<SendNotificationUseCaseResponse>
>

describe('On Comment a Question', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    )
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    inMemoryNotificationRepository = new InMemoryNotificationRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationRepository,
    )
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnQuestionComment(inMemoryQuestionsRepository, sendNotificationUseCase)
  })

  it('should  send a notification when a comment is created on a Question', async () => {
    const question = makeQuestion()
    inMemoryQuestionsRepository.create(question)

    const questionComment = makeQuestionComment({
      questionId: question.id,
    })

    inMemoryQuestionCommentRepository.create(questionComment)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
