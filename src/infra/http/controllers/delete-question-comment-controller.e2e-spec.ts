import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionCommentFactory } from 'test/factories/make-question-comment'
import { StudentFactory } from 'test/factories/make-student'

describe('Delete Answer (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let questionCommentFactory: QuestionCommentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      // rodamos a aplicação em modo teste
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
        QuestionCommentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService) // Fazendo com que o PrismaService fique utilizável aqui dentro dos testes para verificarmos se o registro foi gravado no banco de dados.
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)

    await app.init()
  })

  test('[DELETE] /questions/comments/:id', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'johndoe@teste.com',
      password: '12345',
    })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    })

    const questionComment =
      await questionCommentFactory.makePrismaQuestionComment({
        authorId: user.id,
        questionId: question.id,
      })

    const answerId = answer.id.toString()
    const token = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .delete(`/questions/comments/${questionComment.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(204)

    const commentNotOnDatabase = await prisma.comment.findFirst({
      where: {
        questionId: question.id.toString(),
      },
    })

    expect(commentNotOnDatabase).toBeNull()
  })
})
