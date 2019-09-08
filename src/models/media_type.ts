import * as Knex from 'knex'
import { MapDataType, PartialBy } from './data_types';
import { AbstractCrudModel, Data } from './abstract_crud';

const mediaTypeTable = 'mst_media_type'
const mediaTypeColumns = {
  id: 'id', // int(11) NOT NULL AUTO_INCREMENT,
  type: 'media_type', // varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  code: 'code', // varchar(5) COLLATE utf8_unicode_ci NOT NULL,
  marcPrefix: 'code2', // char(1) COLLATE utf8_unicode_ci NOT NULL,
  created: 'input_date', // date DEFAULT NULL,
  updated: 'last_update', // date DEFAULT NULL,
} as const;

export type MediaTypeData = Data & {
  type: string;
  code: string;
  marcPrefix: string;
};
export type PartialMediaTypeData = PartialBy<MediaTypeData, 'id'>;

type RawMediaTypeData = MapDataType<typeof mediaTypeColumns, MediaTypeData, { id: number }>

function toRaw(data: MediaTypeData): PartialBy<RawMediaTypeData, 'id'> {
  return {
    id: data.id,
    media_type: data.type,
    code: data.code,
    code2: data.marcPrefix,
    input_date: data.created || new Date(),
    last_update: data.updated || new Date(),
  }
}

function toData(data: RawMediaTypeData) {
  return {
    id: data.id,
    type: data.media_type,
    code: data.code,
    marcPrefix: data.code2,
    created: data.input_date,
    updated: data.last_update,
  }
}

export class MediaType extends AbstractCrudModel<MediaTypeData, RawMediaTypeData, 'id'>{
  constructor(db: Knex) {
    super(db, mediaTypeTable, mediaTypeColumns.id);
  }

  protected async toPartialRaw(data: Partial<MediaTypeData>) {
    return {
      id: data.id,
      media_type: data.type,
      code: data.code,
      code2: data.marcPrefix,
      input_date: data.created,
      last_update: data.updated,
    }
  }

  protected async toRaw(data: PartialBy<MediaTypeData, 'id'>) {
    return toRaw(data);
  }

  protected async toData(data: RawMediaTypeData) {
    return toData(data);
  }
}
