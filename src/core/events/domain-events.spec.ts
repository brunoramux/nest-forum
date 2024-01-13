/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-use-before-define */
import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityId } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

class CustomAggregateCreated implements DomainEvent {
  // classe que identifica cada um dos eventos. Ex.: QuestionCreated ou AnswerCreated
  public ocurredAt: Date
  private aggregate: CustomAggregate

  constructor(aggregate: CustomAggregate) {
    // recebe Answer ou Question
    this.aggregate = aggregate // Question ou Answer
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  // classe para disparar o evento. Aqui seria a classe Answer ou Question por exemplo
  static create() {
    const aggregate = new CustomAggregate(null) // por exemplo, criar Answer ou criar Question

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate)) // aggregate tambem possui o metodo addDomainEvent pois extende a classe AggregateRoot

    return aggregate
  }
}

describe('domain events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn()

    // Subscriber Cadastrado (ouvindo o evento de Answer Criado)
    DomainEvents.register(
      // registrando um evento dentro do DomainEvents
      callbackSpy /* função do evento. Esse e o listener. Aqui colocariamos o SendNotification por exemplo */,
      CustomAggregateCreated.name /* nome do evento */,
    )

    // Criando uma resposta porem sem salvar no BD
    const aggregate = CustomAggregate.create()

    expect(aggregate.domainEvents).toHaveLength(1)

    // Estou salvando a resposta no bando de dados e disparando o evento.
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    expect(callbackSpy).toHaveBeenCalled()
    // Apos chamar o evento, os eventos dentro de aggregate são apagados.
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
