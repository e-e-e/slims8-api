import * as Knex from 'knex'
import { MapDataType, PartialBy } from './data_types';
import { AbstractCrudModel, Data } from './abstract_crud';

const publisherTable = 'mst_publisher'
const publisherColumns = {
  id: 'publisher_id', // int(11) NOT NULL AUTO_INCREMENT,
  name: 'publisher_name', // varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  created: 'input_date', // date DEFAULT NULL,
  updated: 'last_update', // date DEFAULT NULL,
} as const;

export type PublisherData = Data & {
  name: string
}
export type PartialPublisherData = PartialBy<PublisherData, 'id'>;

type RawPublisherData = MapDataType<typeof publisherColumns, PublisherData, { publisher_id: number }>

function toRaw(data: PublisherData): PartialBy<RawPublisherData, 'publisher_id'> {
  return {
    publisher_id: data.id,
    publisher_name: data.name,
    input_date: data.created || new Date(),
    last_update: data.updated || new Date(),
  }
}

function toData(data: RawPublisherData) {
  return {
    id: data.publisher_id,
    name: data.publisher_name,
    created: data.input_date,
    updated: data.last_update,
  }
}

export class Publisher extends AbstractCrudModel<PublisherData, RawPublisherData, 'publisher_id'>{
  constructor(db: Knex) {
    super(db, publisherTable, publisherColumns.id);
  }

  protected async toPartialRaw(data: Partial<PublisherData>) {
    return {
      publisher_id: data.id,
      publisher_name: data.name,
      input_date: data.created,
      last_update: data.updated,
    }
  }

  protected async toRaw(data: PartialBy<PublisherData, 'id'>) {
    return toRaw(data);
  }

  protected async toData(data: RawPublisherData) {
    return toData(data);
  }

}
