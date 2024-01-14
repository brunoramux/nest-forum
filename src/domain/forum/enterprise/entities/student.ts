import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface StudentProps {
  name: string
  email: string
  password: string
}
export class Student extends Entity<StudentProps> {
  // envio da tipagem para a classe pai

  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  static create(props: StudentProps, id?: UniqueEntityId) {
    const student = new Student(props, id)
    // tenho acesso ao construtor protected pois estou dentro da classe que extende a classe Entity
    return student
  }
}
