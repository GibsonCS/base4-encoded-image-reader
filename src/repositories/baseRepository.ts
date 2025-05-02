export interface BaseRepostiory<T> {
    save(obj: T): T
    findById(id: string): T | null
    findAll(): T[]
    update(obj: T): T
}