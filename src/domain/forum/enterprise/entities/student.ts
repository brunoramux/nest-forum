import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface StudentProps {
  name: string
}
export class Student extends Entity<StudentProps> {
  // envio da tipagem para a classe pai
  static create(props: StudentProps, id?: UniqueEntityId) {
    const student = new Student(props, id)
    // tenho acesso ao construtor protected pois estou dentro da classe que extende a classe Entity
    return student
  }
}
