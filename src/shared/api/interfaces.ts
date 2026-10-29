export interface PageParams {
  limit?: number
  skip?: number
  /** Пошуковий запит. */
  q?: string
}

export interface Page<T> {
  items: T[]
  total: number
}

export interface Readable<T> {
  getAll(params?: PageParams): Promise<T[]>
  getById(id: number): Promise<T>
}

/** Окремий контракт для пагінації: окрім елементів повертає загальну кількість. */
export interface Pageable<T> {
  getPage(params?: PageParams): Promise<Page<T>>
}

export interface Creatable<T, TCreate> {
  create(data: TCreate): Promise<T>
}

export interface Editable<T, TUpdate> {
  update(id: number, data: TUpdate): Promise<T>
}

export interface Deletable {
  delete(id: number): Promise<void>
}
