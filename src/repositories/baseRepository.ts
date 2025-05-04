export interface BaseRepostiory<T> {
  save(obj: T): T;
  findById(id: string): Promise<T>;
  findAll(): T[];
  update(obj: T): T;
}
