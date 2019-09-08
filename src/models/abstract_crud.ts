import * as Knex from 'knex';
import { PartialBy } from './data_types';

type IdType = number;

export type Data = {
  id?: IdType,
  created?: Date,
  updated?: Date,
};

export type RequiredId<T extends Data> = Omit<T, 'id'> & { id: IdType }

export type SelectOptionsType = { offset?: number, limit: number };

export interface Model<T extends Data> {
  create(data: T | RequiredId<T>): Promise<number | undefined>;
  get(id: number): Promise<RequiredId<T> | undefined>;
  all(options?: SelectOptionsType): Promise<RequiredId<T>[]>;
  find(data: Partial<T>): Promise<RequiredId<T>[]>;
  update(data: RequiredId<T>): Promise<number>;
  delete(id: number): Promise<any>;
}

function stripUndefined<T extends Partial<Record<string, any>>>(data: T): T {
  const v: T = {} as T;
  for (let key in data) {
    data[key] !== undefined && (v[key] = data[key])
  }
  return v;
}

export class AbstractCrudModel<T extends Data, R, I extends keyof R> implements Model<T> {

  constructor(
    protected readonly db: Knex,
    protected readonly table: string,
    protected readonly idColumn: string,
  ) { }

  protected toPartialRaw(data: Partial<T>): Promise<Partial<R>> | Partial<R> {
    throw new Error('not implemented');
  }

  protected toRaw(data: T | RequiredId<T>): Promise<PartialBy<R, I>> | PartialBy<R, I> {
    throw new Error('not implemented');
  }
  protected toData(data: R): Promise<RequiredId<T>> | RequiredId<T> {
    throw new Error('not implemented');
  }

  async create(data: T) {
    const results = await this.db(this.table).insert(await this.toRaw(data));
    return results.length ? results[0] : undefined;
  }

  async get(id: number) {
    const results = await this.db(this.table)
      .select()
      .where(this.idColumn, id);
    return results.length ? await this.toData(results[0]) : undefined;
  }

  async all(options?: SelectOptionsType) {
    let query = this.db(this.table).select();
    if (options) {
      query.limit(options.limit)
      options.offset && query.offset(options.offset);
    }
    const results = await query;
    return Promise.all(results.map(d => this.toData(d)));
  }

  async find(data: Partial<T>) {
    const results = await this.db(this.table)
      .select()
      .where(stripUndefined(await this.toPartialRaw(data)));
    return Promise.all(results.map(d => this.toData(d)));
  }

  async update(data: RequiredId<T>) {
    return this.db(this.table)
      .update(await this.toRaw(data))
      .where(this.idColumn, data.id);
  }

  async delete(id: number) {
    return this.db(this.table)
      .delete()
      .where(this.idColumn, id);
  }
}