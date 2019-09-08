import * as Knex from 'knex'
import { MapDataType, UnreachableError, PartialBy } from './data_types';
import { AbstractCrudModel, Data } from './abstract_crud';

const topicTable = 'mst_topic'
const topicColumns = {
  id: 'topic_id', // int(11) NOT NULL AUTO_INCREMENT,
  name: 'topic', // varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  type: 'topic_type', // enum('t','g','n','tm','gr','oc') COLLATE utf8_unicode_ci NOT NULL,
  authorityList: 'auth_list', // varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  classification: 'classification', // varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Classification Code',
  created: 'input_date', // date DEFAULT NULL,
  updated: 'last_update', // date DEFAULT NULL,
} as const;

export enum TopicType {
  TOPIC,
  GEOGRAPHIC,
  NAME,
  TEMPORAL,
  GENRE,
  OCCUPATION,
}

type RawTopicType = 't' | 'g' | 'n' | 'tm' | 'gr' | 'oc';

export type TopicData = Data & {
  name: string,
  type?: TopicType,
  authorityList?: string,
  classification?: string,
}

type TableOverride = {
  topic_id: number,
  topic_type: RawTopicType,
  classification: string,
}

type RawTopicData = MapDataType<typeof topicColumns, TopicData, TableOverride>

function toRawTopicType(data?: TopicType): RawTopicType {
  switch (data) {
    case undefined:
    case TopicType.TOPIC: return 't';
    case TopicType.GENRE: return 'gr';
    case TopicType.GEOGRAPHIC: return 'g';
    case TopicType.NAME: return 'n';
    case TopicType.OCCUPATION: return 'oc';
    case TopicType.TEMPORAL: return 'tm';
    default:
      throw new UnreachableError(data);
  }
}

function toTopicType(data: RawTopicType): TopicType {
  switch (data) {
    case 'gr': return TopicType.GENRE;
    case 'g': return TopicType.GEOGRAPHIC;
    case 'n': return TopicType.NAME;
    case 'oc': return TopicType.OCCUPATION;
    case 'tm': return TopicType.TEMPORAL;
    case 't': return TopicType.TOPIC;
    default:
      throw new UnreachableError(data);
  }
}

function toRaw(data: PartialBy<TopicData, 'id'>): PartialBy<RawTopicData, 'topic_id'> {
  return {
    topic_id: data.id,
    topic: data.name,
    topic_type: toRawTopicType(data.type),
    auth_list: data.authorityList,
    classification: data.classification || '',
    input_date: data.created || new Date(),
    last_update: data.updated || new Date(),
  }
}

function toData(data: RawTopicData) {
  return {
    id: data.topic_id,
    name: data.topic,
    type: toTopicType(data.topic_type),
    authorityList: data.auth_list,
    classification: data.classification,
    created: data.input_date,
    updated: data.last_update,
  }
}

export class Topic extends AbstractCrudModel<TopicData, RawTopicData, 'topic_id'>{
  constructor(db: Knex) {
    super(db, topicTable, topicColumns.id);
  }

  protected async toPartialRaw(data: Partial<TopicData>) {
    return {
      topic_id: data.id,
      topic: data.name,
      topic_type: data.type != undefined ? toRawTopicType(data.type) : undefined,
      auth_list: data.authorityList,
      classification: data.classification,
    }
  }

  protected async toRaw(data: PartialBy<TopicData, 'id'>) {
    return toRaw(data);
  }

  protected async toData(data: RawTopicData) {
    return toData(data);
  }
}
