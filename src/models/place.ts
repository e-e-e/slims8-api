import * as Knex from 'knex'
import { MapDataType, PartialBy } from './data_types';
import { AbstractCrudModel, Data } from './abstract_crud';

const placeTable = 'mst_place'
const placeColumns = {
  id: 'place_id', // int(11) NOT NULL AUTO_INCREMENT,
  name: 'place_name', // varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  created: 'input_date', // date DEFAULT NULL,
  updated: 'last_update', // date DEFAULT NULL,
} as const;

export type PlaceData = Data & {
  name: string
}
export type PartialPlaceData = PartialBy<PlaceData, 'id'>;

type RawPlaceData = MapDataType<typeof placeColumns, PlaceData>

function toRaw(data: PlaceData): PartialBy<RawPlaceData, 'place_id'> {
  return {
    place_id: data.id,
    place_name: data.name,
    input_date: data.created || new Date(),
    last_update: data.updated || new Date(),
  }
}

function toData(data: RawPlaceData) {
  return {
    id: data.place_id || 0,
    name: data.place_name,
    created: data.input_date,
    updated: data.last_update,
  }
}

export class Place extends AbstractCrudModel<PlaceData, RawPlaceData, 'place_id'>{
  constructor(db: Knex) {
    super(db, placeTable, placeColumns.id);
  }

  protected async toPartialRaw(data: Partial<PlaceData>) {
    return {
      place_id: data.id,
      place_name: data.name,
      input_date: data.created,
      last_update: data.updated,
    }
  }

  protected async toRaw(data: PartialBy<PlaceData, 'id'>) {
    return toRaw(data);
  }

  protected async toData(data: RawPlaceData) {
    return toData(data);
  }

}
