import * as Knex from 'knex'
import { MapDataType, PartialBy, RequiredBy, Invert } from './data_types';
import { AbstractCrudModel, Data } from './abstract_crud';

const gmdTable = 'mst_gmd'
const gmdColumns = {
  id: 'gmd_id', // int(11) NOT NULL AUTO_INCREMENT,
  code: 'gmd_code', // varchar(3) COLLATE utf8_unicode_ci DEFAULT NULL,
  name: 'gmd_name', // varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  iconImage: 'icon_image', // varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  created: 'input_date', // date DEFAULT NULL,
  updated: 'last_update', // date DEFAULT NULL,
} as const;

export type GmdData = Data & {
  name: string,
  code?: string,
  iconImage?: string,
}

type TableOverride = {
  gmd_id: number
};
type RawGmdData = MapDataType<typeof gmdColumns, GmdData, TableOverride>;

function toRaw(data: GmdData) {
  return {
    gmd_id: data.id,
    gmd_code: data.code,
    gmd_name: data.name,
    icon_image: data.iconImage,
    input_date: data.created || new Date(),
    last_update: data.updated || new Date(),
  }
}

function toData(data: RawGmdData) {
  return {
    id: data.gmd_id,
    code: data.gmd_code,
    name: data.gmd_name,
    iconImage: data.icon_image,
    created: data.input_date,
    updated: data.last_update,
  }
}

// function part<
//   T extends Partial<Record<keyof K, any>>,
//   O extends Record<keyof Invert<K>, any>,
//   K extends Record<string, string>
// >(data: T, map: K) {
//   const o: Partial<O> = {}
//   for (let key in map) {
//     const value = data[key];
//     if (value != undefined) {
//       o[map[key]] = data[key];
//     }
//   }
//   return o;
// }

// const x = part<GmdData, RawGmdData, typeof gmdColumns>({ name: 'hello' }, gmdColumns);

export class GeneralMaterialDesignation extends AbstractCrudModel<GmdData, RawGmdData, 'gmd_id'>{
  constructor(db: Knex) {
    super(db, gmdTable, gmdColumns.id);
  }

  protected async toPartialRaw(data: Partial<GmdData>) {
    return {
      gmd_id: data.id,
      gmd_code: data.code,
      gmd_name: data.name,
      icon_image: data.iconImage,
      input_date: data.created,
      last_update: data.updated,
    }
  }

  protected async toRaw(data: PartialBy<GmdData, 'id'>) {
    return toRaw(data);
  }

  protected async toData(data: RawGmdData) {
    return toData(data);
  }

}
