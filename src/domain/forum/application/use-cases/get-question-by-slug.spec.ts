import { InMemoryQuestionRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { makeQuestion } from 'test/factories/make-question'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'
import { makeAttachment } from 'test/factories/make-attachment'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionRepository: InMemoryQuestionRepository
let questionBySlug: GetQuestionBySlugUseCase
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentsRepository

describe('Get Question By Slug', () => {
  beforeEach(async () => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    )
    questionBySlug = new GetQuestionBySlugUseCase(inMemoryQuestionRepository)
  })

  it('It should be able to get a question by slug', async () => {
    const student = makeStudent({ name: 'Bruno Ramos' })
    inMemoryStudentsRepository.create(student)

    const newQuestion = makeQuestion({
      slug: Slug.createFromText('Example Bruno'), // setando uma das propriedades. As demais ficara padrao
      authorId: student.id,
    })
    await inMemoryQuestionRepository.create(newQuestion)

    const attachment = makeAttachment({
      title: 'Some Attachment',
    })
    inMemoryAttachmentsRepository.create(attachment)

    const questionAttachment = QuestionAttachment.create({
      questionId: newQuestion.id,
      attachmentId: attachment.id,
    })
    inMemoryQuestionAttachmentRepository.items.push(questionAttachment)

    const result = await questionBySlug.execute({ slug: 'example-bruno' })

    expect(result.isRight()).toBe(true)

    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: newQuestion.title,
        author: 'Bruno Ramos',
        attachments: [
          expect.objectContaining({
            title: 'Some Attachment',
          }),
        ],
      }),
    })
  })
})
