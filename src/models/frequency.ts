import * as Knex from 'knex'
import { MapDataType, PartialBy } from './data_types';
import { AbstractCrudModel, Data } from './abstract_crud';

const frequencyTable = 'mst_frequency'
const frequencyColumns = {
  id: 'frequency_id', // int(11) NOT NULL AUTO_INCREMENT,
  frequency: 'frequency', // varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  languagePrefix: 'language_prefix', // varchar(5) COLLATE utf8_unicode_ci DEFAULT NULL,
  timeIncrement: 'time_increment', // smallint(6) DEFAULT NULL,
  timeUnit: 'time_unit', // enum('day','week','month','year') COLLATE utf8_unicode_ci DEFAULT 'day',
  created: 'input_date', // date DEFAULT NULL,
  updated: 'last_update', // date DEFAULT NULL,
} as const;

export type FrequencyData = Data & {
  frequency: string,
  languagePrefix?: string,
  timeIncrement?: number,
  timeUnit: 'day' | 'week' | 'month' | 'year',
}

type RawFrequencyData = MapDataType<typeof frequencyColumns, FrequencyData, { frequency_id: number }>

function toRaw(data: PartialBy<FrequencyData, 'id'>): PartialBy<RawFrequencyData, 'frequency_id'> {
  return {
    frequency_id: data.id,
    frequency: data.frequency,
    language_prefix: data.languagePrefix,
    time_increment: data.timeIncrement,
    time_unit: data.timeUnit,
    input_date: data.created || new Date(),
    last_update: data.updated || new Date(),
  }
}

function toData(data: RawFrequencyData) {
  return {
    id: data.frequency_id,
    frequency: data.frequency,
    languagePrefix: data.language_prefix,
    timeIncrement: data.time_increment,
    timeUnit: data.time_unit,
    created: data.input_date,
    updated: data.last_update,
  }
}

export class Frequency extends AbstractCrudModel<FrequencyData, RawFrequencyData, 'frequency_id'>{
  constructor(db: Knex) {
    super(db, frequencyTable, frequencyColumns.id);
  }

  protected async toRaw(data: PartialBy<FrequencyData, 'id'>) {
    return toRaw(data);
  }

  protected async toData(data: RawFrequencyData) {
    return toData(data);
  }

}
