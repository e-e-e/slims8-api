import Knex from 'knex';
import { MapDataType } from './data_types';
import { SelectOptionsType, Data } from './abstract_crud';


export type LanguageData = {
  id: string,
  name: string,
} & Pick<Data, 'created' | 'updated'>;

const languageTable = 'mst_language';
const languageColumns = {
  id: 'language_id', // char(5) COLLATE utf8_unicode_ci NOT NULL,
  name: 'language_name', // varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  created: 'input_date', // date DEFAULT NULL,
  updated: 'last_update', // date DEFAULT NULL,
} as const;

type RawLanguageData = MapDataType<typeof languageColumns, LanguageData>

interface Model<T extends Data> {
  create(data: T): Promise<number | undefined>;
  get(id: string): Promise<T | undefined>;
  all(options?: SelectOptionsType): Promise<T[]>;
  find(data: Partial<T>): Promise<T[]>;
  update(data: T): Promise<number>;
  delete(id: string): Promise<any>;
}

export class Language implements Model<LanguageData> {
  private readonly table = languageTable;
  private readonly idColumn = languageColumns.id;

  constructor(
    protected readonly db: Knex,
  ) { }

  protected toPartialRaw(data: Partial<LanguageData>): Partial<RawLanguageData> {
    return {
      language_id: data.id,
      language_name: data.name,
    };
  }

  protected toRaw(data: LanguageData): RawLanguageData {
    return {
      language_id: data.id,
      language_name: data.name,
      input_date: data.created || new Date(),
      last_update: data.updated || new Date(),
    };
  }
  protected toData(data: RawLanguageData): LanguageData {
    return {
      id: data.language_id,
      name: data.language_name,
      created: data.input_date,
      updated: data.last_update,
    };
  }

  async create(data: LanguageData): Promise<number | undefined> {
    const results = await this.db(this.table).insert(await this.toRaw(data));
    return results.length ? results[0] : undefined;
  };

  async get(id: string) {
    const results = await this.db(this.table)
      .select()
      .where(this.idColumn, id);
    return results.length ? await this.toData(results[0]) : undefined;
  };

  async all(options?: SelectOptionsType) {
    let query = this.db(this.table).select();
    if (options) {
      query.limit(options.limit)
      options.offset && query.offset(options.offset);
    }
    const results = await query;
    return Promise.all(results.map(d => this.toData(d)));
  };

  async find(data: Partial<LanguageData>) {
    const results = await this.db(this.table)
      .select()
      .where(this.toPartialRaw(data));
    return Promise.all(results.map(d => this.toData(d)));
  };

  async update(data: LanguageData) {
    return this.db(this.table)
      .update(await this.toRaw(data))
      .where(this.idColumn, data.id);
  };

  async delete(id: string) {
    return this.db(this.table)
      .delete()
      .where(this.idColumn, id);
  };
}