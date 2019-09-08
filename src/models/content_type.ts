import * as Knex from 'knex'
import { MapDataType, PartialBy } from './data_types';
import { AbstractCrudModel, Data } from './abstract_crud';

const contentTypeTable = 'mst_content_type'
const contentTypeColumns = {
  id: 'id', // int(11) NOT NULL AUTO_INCREMENT,
  type: 'content_type', // varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  code: 'code', // varchar(5) COLLATE utf8_unicode_ci NOT NULL,
  marcPrefix: 'code2', // char(1) COLLATE utf8_unicode_ci NOT NULL,
  created: 'input_date', // date DEFAULT NULL,
  updated: 'last_update', // date DEFAULT NULL,
} as const;

export type ContentTypeData = Data & {
  type: string;
  code: string;
  marcPrefix: string;
};
export type PartialContentTypeData = PartialBy<ContentTypeData, 'id'>;

type RawContentTypeData = MapDataType<typeof contentTypeColumns, ContentTypeData, { id: number }>

function toRaw(data: ContentTypeData): PartialBy<RawContentTypeData, 'id'> {
  return {
    id: data.id,
    content_type: data.type,
    code: data.code,
    code2: data.marcPrefix,
    input_date: data.created || new Date(),
    last_update: data.updated || new Date(),
  }
}

function toData(data: RawContentTypeData) {
  return {
    id: data.id,
    type: data.content_type,
    code: data.code,
    marcPrefix: data.code2,
    created: data.input_date,
    updated: data.last_update,
  }
}

export class ContentType extends AbstractCrudModel<ContentTypeData, RawContentTypeData, 'id'>{
  constructor(db: Knex) {
    super(db, contentTypeTable, contentTypeColumns.id);
  }

  protected async toPartialRaw(data: Partial<ContentTypeData>) {
    return {
      id: data.id,
      content_type: data.type,
      code: data.code,
      code2: data.marcPrefix,
      input_date: data.created,
      last_update: data.updated,
    }
  }

  protected async toRaw(data: PartialBy<ContentTypeData, 'id'>) {
    return toRaw(data);
  }

  protected async toData(data: RawContentTypeData) {
    return toData(data);
  }
}
