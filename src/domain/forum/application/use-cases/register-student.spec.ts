import { FakeHasher } from 'test/cryptography/fake-hasher'
import { RegisterStudentUseCase } from './register-student'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let registerStudent: RegisterStudentUseCase
let fakeHasher: FakeHasher

describe('Register a Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    registerStudent = new RegisterStudentUseCase(
      inMemoryStudentsRepository,
      fakeHasher,
    )
  })

  it('It should be able to register a Student', async () => {
    const result = await registerStudent.execute({
      name: 'Bruno Ramos',
      email: 'bruno.lemos@live.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      student: inMemoryStudentsRepository.items[0],
    })
  })

  it('It should hash the password', async () => {
    const result = await registerStudent.execute({
      name: 'Bruno Ramos',
      email: 'bruno.lemos@live.com',
      password: '123456',
    })
    const hashedPasswort = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryStudentsRepository.items[0].password).toEqual(hashedPasswort)
  })
})
