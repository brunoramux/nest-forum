import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Create Question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      // rodamos a aplicação em modo teste
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService) // Fazendo com que o PrismaService fique utilizável aqui dentro dos testes para verificarmos se o registro foi gravado no banco de dados.
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@teste.com',
        password: await hash('123456', 8),
      },
    })

    const token = jwt.sign({ sub: user.id, role: 'ADMIN' })

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Conteudo 1',
        title: 'Titulo 1',
        slug: 'titulo-1',
        authorId: '1234',
      })

    expect(response.statusCode).toBe(201)

    const questionOnDatabase = await prisma.question.findUnique({
      where: {
        slug: 'titulo-1',
      },
    })

    expect(questionOnDatabase).toBeTruthy()
  })
})
