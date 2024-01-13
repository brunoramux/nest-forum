export abstract class WatchedList<T> {
  public currentItems: T[] // valor atual da lista conforme as mudanças são realizadas
  private initial: T[] // valor inicial da lista
  private new: T[] // valores a serem incluidos na lista
  private removed: T[] // valores a serem removidos da lista

  constructor(initialItems?: T[]) {
    this.currentItems = initialItems || []
    this.initial = initialItems || []
    this.new = []
    this.removed = []
  }

  abstract compareItems(a: T, b: T): boolean // metodo a ser implementado na classe filhoy

  public getItems(): T[] {
    return this.currentItems
  }

  public getNewItems(): T[] {
    return this.new
  }

  public getRemovedItems(): T[] {
    return this.removed
  }

  private isCurrentItem(item: T): boolean {
    return (
      this.currentItems.filter((v: T) => this.compareItems(item, v)).length !==
      0
    )
  }

  private isNewItem(item: T): boolean {
    return this.new.filter((v: T) => this.compareItems(item, v)).length !== 0
  }

  private isRemovedItem(item: T): boolean {
    return (
      this.removed.filter((v: T) => this.compareItems(item, v)).length !== 0
    )
  }

  private removeFromNew(item: T): void {
    this.new = this.new.filter((v) => !this.compareItems(v, item))
  }

  private removeFromCurrent(item: T): void {
    this.currentItems = this.currentItems.filter(
      (v) => !this.compareItems(item, v),
    )
  }

  private removeFromRemoved(item: T): void {
    this.removed = this.removed.filter((v) => !this.compareItems(item, v))
  }

  private wasAddedInitially(item: T): boolean {
    return (
      this.initial.filter((v: T) => this.compareItems(item, v)).length !== 0
    )
  }

  public exists(item: T): boolean {
    return this.isCurrentItem(item)
  }

  public add(item: T): void {
    if (this.isRemovedItem(item)) {
      // verifica se o item a ser adicionado esta na lista de removidos
      this.removeFromRemoved(item) // se sim, remove o item da lista de removidos
    }

    if (!this.isNewItem(item) && !this.wasAddedInitially(item)) {
      // verifica se o item nao esta na lista de novos itens ou estava na lista inicial
      this.new.push(item) // se verdadeiro, adiciona o item
    }

    if (!this.isCurrentItem(item)) {
      // verifica se item ja nao existe na lista atual
      this.currentItems.push(item) // se verdadeiro, adiciona o item na lista atual
    }
  }

  public remove(item: T): void {
    this.removeFromCurrent(item)

    if (this.isNewItem(item)) {
      this.removeFromNew(item)

      return
    }

    if (!this.isRemovedItem(item)) {
      this.removed.push(item)
    }
  }

  public update(items: T[]): void {
    const newItems = items.filter((a) => {
      // quais itens foram adicionados
      return !this.getItems().some((b) => this.compareItems(a, b)) // initial = [1, 2, 3]  items = [1, 3, 5] - Para cada item em `items` verificamos se ele existe em `initial`. Se existir, não deve ser adicionado a `newItems`
    })

    const removedItems = this.getItems().filter((a) => {
      return !items.some((b) => this.compareItems(a, b))
    })

    this.currentItems = items
    this.new = newItems
    this.removed = removedItems
  }
}
