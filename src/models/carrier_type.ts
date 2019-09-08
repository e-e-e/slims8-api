import * as Knex from 'knex'
import { MapDataType, PartialBy } from './data_types';
import { AbstractCrudModel, Data } from './abstract_crud';

const carrierTypeTable = 'mst_carrier_type'
const carrierTypeColumns = {
  id: 'id', // int(11) NOT NULL AUTO_INCREMENT,
  type: 'carrier_type', // varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  code: 'code', // varchar(5) COLLATE utf8_unicode_ci NOT NULL,
  marcPrefix: 'code2', // char(1) COLLATE utf8_unicode_ci NOT NULL,
  created: 'input_date', // date DEFAULT NULL,
  updated: 'last_update', // date DEFAULT NULL,
} as const;

export type CarrierTypeData = Data & {
  type: string;
  code: string;
  marcPrefix: string;
};
export type PartialCarrierTypeData = PartialBy<CarrierTypeData, 'id'>;

type RawCarrierTypeData = MapDataType<typeof carrierTypeColumns, CarrierTypeData, { id: number }>

function toRaw(data: CarrierTypeData): PartialBy<RawCarrierTypeData, 'id'> {
  return {
    id: data.id,
    carrier_type: data.type,
    code: data.code,
    code2: data.marcPrefix,
    input_date: data.created || new Date(),
    last_update: data.updated || new Date(),
  }
}

function toData(data: RawCarrierTypeData) {
  return {
    id: data.id,
    type: data.carrier_type,
    code: data.code,
    marcPrefix: data.code2,
    created: data.input_date,
    updated: data.last_update,
  }
}

export class CarrierType extends AbstractCrudModel<CarrierTypeData, RawCarrierTypeData, 'id'>{
  constructor(db: Knex) {
    super(db, carrierTypeTable, carrierTypeColumns.id);
  }

  protected async toPartialRaw(data: Partial<CarrierTypeData>) {
    return {
      id: data.id,
      carrier_type: data.type,
      code: data.code,
      code2: data.marcPrefix,
      input_date: data.created,
      last_update: data.updated,
    }
  }

  protected async toRaw(data: PartialBy<CarrierTypeData, 'id'>) {
    return toRaw(data);
  }

  protected async toData(data: RawCarrierTypeData) {
    return toData(data);
  }
}
