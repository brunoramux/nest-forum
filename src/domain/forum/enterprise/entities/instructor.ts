import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface InstructorProps {
  name: string
}
export class Instructor extends Entity<InstructorProps> {
  // envio da tipagem para a classe pai
  static create(props: InstructorProps, id?: UniqueEntityId) {
    const instructor = new Instructor(props, id)
    // tenho acesso ao construtor protected pois estou dentro da classe que extende a classe Entity
    return instructor
  }
}
