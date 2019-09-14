import * as Knex from 'knex'
import { MapDataType, PartialBy } from './data_types';
import { AbstractCrudModel, Data } from './abstract_crud';

const collectionTable = 'mst_coll_type'
const collectionColumns = {
  id: 'coll_type_id', // int(3) NOT NULL AUTO_INCREMENT,
  name: 'coll_type_name', // varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  created: 'input_date', // date DEFAULT NULL,
  updated: 'last_update', // date DEFAULT NULL,
} as const;

export type CollectionData = Data & {
  name: string;
}

type RawCollectionData = MapDataType<typeof collectionColumns, CollectionData, { coll_type_id: number }>

function toRaw(data: CollectionData): PartialBy<RawCollectionData, 'coll_type_id'> {
  return {
    coll_type_id: data.id,
    coll_type_name: data.name,
    input_date: data.created || new Date(),
    last_update: data.updated || new Date(),
  }
}

function toData(data: RawCollectionData) {
  return {
    id: data.coll_type_id,
    name: data.coll_type_name,
    created: data.input_date,
    updated: data.last_update,
  }
}

export class Collection extends AbstractCrudModel<CollectionData, RawCollectionData, 'coll_type_id'>{
  constructor(db: Knex) {
    super(db, collectionTable, collectionColumns.id);
  }

  protected async toPartialRaw(data: Partial<CollectionData>) {
    return {
      coll_type_id: data.id,
      coll_type_name: data.name,
      input_date: data.created,
      last_update: data.updated,
    }
  }

  protected async toRaw(data: PartialBy<CollectionData, 'id'>) {
    return toRaw(data);
  }

  protected async toData(data: RawCollectionData) {
    return toData(data);
  }

}
