import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionCommentFactory } from 'test/factories/make-question-comment'
import { StudentFactory } from 'test/factories/make-student'

describe('Fetch question comments (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let questionComments: QuestionCommentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        QuestionFactory,
        StudentFactory,
        AnswerFactory,
        QuestionCommentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionComments = moduleRef.get(QuestionCommentFactory)

    await app.init()
  })

  test('[GET] /questions/:id/comments', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    await questionComments.makePrismaQuestionComment({
      authorId: user.id,
      questionId: question.id,
      content: 'Comentario 1',
    })

    const response = await request(app.getHttpServer())
      .get(`/questions/${question.id.toString()}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      questionComments: [expect.objectContaining({ content: 'Comentario 1' })],
    })
  })
})
