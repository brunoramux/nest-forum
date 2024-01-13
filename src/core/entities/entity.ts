import { UniqueEntityId } from './unique-entity-id'

export class Entity<Props> {
  private _id: UniqueEntityId
  protected props: Props

  get id() {
    return this._id
  }

  protected constructor(props: Props, id?: UniqueEntityId) {
    this._id = id ?? new UniqueEntityId(id)
    this.props = props
  }

  public equals(entity: Entity<any>) {
    // usar  esse metodo sempre que precisarmos validar se uma entidade e igual a outra
    if (entity === this) {
      return true
    }

    if (entity.id === this._id) {
      return true
    }

    return false
  }
}
