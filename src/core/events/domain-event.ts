import { UniqueEntityId } from '../entities/unique-entity-id'

export interface DomainEvent {
  // classes de eventos devem estender essa interface
  ocurredAt: Date
  getAggregateId(): UniqueEntityId
}
