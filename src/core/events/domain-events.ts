import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityId } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'

type DomainEventCallback = (event: any) => void

export class DomainEvents {
  private static handlersMap: Record<string, DomainEventCallback[]> = {} // objeto que representar os subscribers. Parametro string = nome do evento DomainEventCallback = subscribers
  private static markedAggregates: AggregateRoot<any>[] = [] // os eventos disparados serão do tipo agregados. Um agregado é setado nessa variavel mas o evento ainda não é disparado. O método dispatchAggregateEvents vai disparar o evento posteriormente (garantia que os dados foram salvos corretamente.)

  public static markAggregateForDispatch(aggregate: AggregateRoot<any>) {
    // método que adiciona eventos a serem disparados.
    const aggregateFound = !!this.findMarkedAggregateByID(aggregate.id)

    if (!aggregateFound) {
      this.markedAggregates.push(aggregate) // adiciona apenas se ele nao for encontrado, no caso do evento ja ter sido incluido anteriormente.
    }
  }

  private static dispatchAggregateEvents(aggregate: AggregateRoot<any>) {
    // método que dispara os eventos
    aggregate.domainEvents.forEach((event: DomainEvent) => this.dispatch(event))
  }

  private static removeAggregateFromMarkedDispatchList(
    // remove evento apos ele ser disparado
    aggregate: AggregateRoot<any>,
  ) {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate))

    this.markedAggregates.splice(index, 1)
  }

  private static findMarkedAggregateByID(
    id: UniqueEntityId,
  ): AggregateRoot<any> | undefined {
    return this.markedAggregates.find((aggregate) => aggregate.id.equals(id))
  }

  public static dispatchEventsForAggregate(id: UniqueEntityId) {
    const aggregate = this.findMarkedAggregateByID(id) // procura o evento passado no ID

    if (aggregate) {
      this.dispatchAggregateEvents(aggregate) // chama método que dispara o evento
      aggregate.clearEvents()
      this.removeAggregateFromMarkedDispatchList(aggregate)
    }
  }

  public static register(
    // colocar evento no handlersMap
    callback: DomainEventCallback,
    eventClassName: string,
  ) {
    const wasEventRegisteredBefore = eventClassName in this.handlersMap

    if (!wasEventRegisteredBefore) {
      this.handlersMap[eventClassName] = []
    }

    this.handlersMap[eventClassName].push(callback) // adiciona ação ao evento
  }

  public static clearHandlers() {
    this.handlersMap = {}
  }

  public static clearMarkedAggregates() {
    this.markedAggregates = []
  }

  private static dispatch(event: DomainEvent) {
    const eventClassName: string = event.constructor.name

    const isEventRegistered = eventClassName in this.handlersMap // verifica se o register foi executado para aquele evento

    if (isEventRegistered) {
      const handlers = this.handlersMap[eventClassName]

      for (const handler of handlers) {
        handler(event)
      }
    }
  }
}
