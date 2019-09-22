import Knex from 'knex';
import { MapDataType } from './data_types';
import { AbstractCrudModel, Data, RequiredId, createOrUpdate, maybeGetData } from './abstract_crud';
import { GeneralMaterialDesignation, GmdData } from './gmd';
import { Frequency, FrequencyData } from './frequency';
import { Publisher, PublisherData } from './publisher';
import { Place, PlaceData } from './place';
import { CarrierType, CarrierTypeData } from './carrier_type';
import { ContentType, ContentTypeData } from './content_type';
import { MediaType, MediaTypeData } from './media_type';
import { Language, LanguageData } from './language';
import { Author, AuthorData } from './author';
import { Topic, TopicData } from './topic';

export type BiblioData = Data & {
  gmd?: GmdData,
  language?: LanguageData,
  publisher?: PublisherData,
  publishPlace?: PlaceData,
  frequency?: FrequencyData,
  contentType?: ContentTypeData,
  mediaType?: MediaTypeData,
  carrierType?: CarrierTypeData,
  title: string,
  isbnIssn?: string,
  statementOfResponsibility?: string,
  edition?: string,
  collation?: string,
  seriesTitle?: string,
  callNumber?: string,
  classification?: string,
  publishYear?: string,
  notes?: string,
  image?: string, // varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  // file_att: string, // varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  labels?: string, // serialised PHP Urg.
  specDetailInfo?: string,
  hide?: boolean,
  promoted?: boolean,
}
// export type PartialBiblio = BiblioData;

const biblioTable = `biblio`;
const biblioColumns = {
  id: 'biblio_id', // int(11) NOT NULL AUTO_INCREMENT,
  gmd: 'gmd_id', //number | null,// int(3) DEFAULT NULL,
  title: 'title', // COLLATE utf8_unicode_ci NOT NULL,
  statementOfResponsibility: 'sor', // varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  edition: 'edition', // varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  isbnIssn: 'isbn_issn', // varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  publisher: 'publisher_id', // int(11) DEFAULT NULL,
  publishYear: 'publish_year', // varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  collation: 'collation', // varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  seriesTitle: 'series_title', // varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  callNumber: 'call_number', // varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  language: 'language_id', // COLLATE utf8_unicode_ci DEFAULT 'en',
  source: 'source', // varchar(3) COLLATE utf8_unicode_ci DEFAULT NULL,
  publishPlace: 'publish_place_id', // int(11) DEFAULT NULL,
  classification: 'classification', // varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL,
  notes: 'notes', // text COLLATE utf8_unicode_ci,
  image: 'image', // varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  // fileAttachment: 'file_att', // varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  hide: 'opac_hide', //, 1) DEFAULT '0',
  promoted: 'promoted', //, 1) DEFAULT '0',
  labels: 'labels', // text COLLATE utf8_unicode_ci,
  frequency: 'frequency_id', // NOT NULL DEFAULT '0',
  specDetailInfo: 'spec_detail_info', // COLLATE utf8_unicode_ci,
  contentType: 'content_type_id', // int(11) DEFAULT NULL,
  mediaType: 'media_type_id', // int(11) DEFAULT NULL,
  carrierType: 'carrier_type_id', // int(11) DEFAULT NULL,
  created: 'input_date',  // datetime DEFAULT NULL,
  // uid: 'uid', // int(11) DEFAULT NULL,  created: `input_date`, //  date NOT NULL,
  updated: `last_update` // date DEFAULT NULL,
} as const;

type RawBiblioDataOverrides = {
  biblio_id: number,
  gmd_id?: number,
  language_id?: string,
  publisher_id?: number,
  publish_place_id?: number,
  frequency_id?: number, // default 0
  content_type_id?: number,
  media_type_id?: number,
  carrier_type_id?: number,
  opac_hide: number,
  promoted: number,
  notes: string,
}

type RawBiblioData = MapDataType<typeof biblioColumns, BiblioData, RawBiblioDataOverrides>

type Models = {
  publisher: Publisher,
  gmd: GeneralMaterialDesignation,
  place: Place,
  mediaType: MediaType,
  contentType: ContentType,
  carrierType: CarrierType,
  frequency: Frequency,
  language: Language,
  topic: Topic,
  author: Author,
}

async function maybeCreateLanguage(data: LanguageData | undefined, model: Language) {
  if (!data) return;
  try {
    await model.create(data);
  } catch (e) {
    const matches = await model.find(data);
    // do we need to update?
    return matches.length ? matches[0].id : undefined;
  }
  return data.id;
}



export class Biblio extends AbstractCrudModel<BiblioData, RawBiblioData, 'biblio_id'> {

  private readonly authorRelationTable = 'biblio_author';
  private readonly topicRelationTable = 'biblio_topic';

  constructor(
    db: Knex,
    private readonly models: Models,
  ) {
    super(db, biblioTable, biblioColumns.id);
  }

  // Author related functions

  async addAuthor(biblioId: number, author: AuthorData | number, level: number) {
    // Do we throw error if biblioId does not exist or author does not exist
    if (!await this.get(biblioId)) throw new Error(`Biblio with id ${author} does not exist`);
    let id = typeof author === 'number' ? author : author.id;
    if (id !== undefined) {
      const a = await this.models.author.get(id)
      if (!a && typeof author === 'number') {
        throw new Error(`Author with id ${author} does not exist`);
      } else if (!a) {
        id = undefined;
      }
    }
    if (id === undefined && typeof author !== 'number') {
      try {
        id = await this.models.author.create(author);
      } catch (e) {
        if (!/ER_DUP_ENTRY/.test(e.message)) throw e;
        const entries = await this.models.author.find(author);
        if (entries.length === 0) throw new Error(`Cannot find authors ${author}`);
        id = entries[0].id;
      }
    }
    try {
      await this.db(this.authorRelationTable).insert({
        [biblioColumns.id]: biblioId,
        author_id: id,
        level,
      });
      return id;
    } catch (e) {
      if (!/ER_DUP_ENTRY/.test(e.message)) throw e;
    }
  }

  async getAuthors(biblioId: number) {
    const results = await this.db(this.authorRelationTable).select('author_id').where(biblioColumns.id, biblioId);
    return Promise.all(
      results.map(result => this.models.author.get(result.author_id))
    );
  }

  async removeAuthor(biblioId: number, author: AuthorData | number) {
    if (typeof author !== 'number' && !author.id) {
      throw new Error('Author with id required!');
    }
    return this.db(this.authorRelationTable).delete().where({
      [biblioColumns.id]: biblioId,
      author_id: typeof author !== 'number' ? author.id : author,
    });
  }

  // Topic related functions
  // TODO: make relational methods generic

  async addTopic(biblioId: number, topic: TopicData | number, level: number) {
    // Do we throw error if biblioId does not exist or topic does not exist
    if (!await this.get(biblioId)) throw new Error(`Biblio with id ${topic} does not exist`);
    let id = typeof topic === 'number' ? topic : topic.id;
    if (id !== undefined) {
      const a = await this.models.topic.get(id)
      if (!a && typeof topic === 'number') {
        throw new Error(`Topic with id ${topic} does not exist`);
      } else if (!a) {
        id = undefined;
      }
    }
    if (id === undefined && typeof topic !== 'number') {
      try {
        id = await this.models.topic.create(topic);
      } catch (e) {
        if (!/ER_DUP_ENTRY/.test(e.message)) throw e;
        const entries = await this.models.topic.find(topic);
        if (entries.length === 0) throw new Error(`Cannot find topics ${topic}`);
        id = entries[0].id;
      }
    }
    try {
      await this.db(this.topicRelationTable).insert({
        [biblioColumns.id]: biblioId,
        topic_id: id,
        level,
      });
    } catch (e) {
      if (!/ER_DUP_ENTRY/.test(e.message)) throw e;
    }
  }

  async getTopics(biblioId: number) {
    const results = await this.db(this.topicRelationTable).select('topic_id').where(biblioColumns.id, biblioId);
    return Promise.all(
      results.map(result => this.models.topic.get(result.topic_id))
    );
  }

  async removeTopic(biblioId: number, topic: TopicData | number) {
    if (typeof topic !== 'number' && !topic.id) {
      throw new Error('Author with id required!');
    }
    return this.db(this.topicRelationTable).delete().where({
      [biblioColumns.id]: biblioId,
      topic_id: typeof topic !== 'number' ? topic.id : topic,
    });
  }

  protected toPartialRaw(data: Partial<BiblioData>) {
    return {
      biblio_id: data.id,
      language_id: data.language && data.language.id,
      gmd_id: data.gmd && data.gmd.id,
      publisher_id: data.publisher && data.publisher.id,
      publish_place_id: data.publishPlace && data.publishPlace.id,
      frequency_id: data.frequency && data.frequency.id,
      content_type_id: data.contentType && data.contentType.id,
      media_type_id: data.mediaType && data.mediaType.id,
      carrier_type_id: data.carrierType && data.carrierType.id,
      title: data.title,
      sor: data.statementOfResponsibility,
      edition: data.edition,
      isbn_issn: data.isbnIssn,
      publish_year: data.publishYear,
      collation: data.collation,
      series_title: data.seriesTitle,
      call_number: data.callNumber,
      classification: data.classification,
      notes: data.notes,
      image: data.image,
      // file_att: null,
      opac_hide: data.hide == undefined ? undefined : data.hide ? 1 : 0,
      promoted: data.hide == undefined ? undefined : data.hide ? 1 : 0,
      labels: data.labels,
      spec_detail_info: data.specDetailInfo,
    };
  }

  protected async toRaw(data: BiblioData) {
    return {
      biblio_id: data.id,
      language_id: data.language ? await maybeCreateLanguage(data.language, this.models.language) : 'en',
      gmd_id: await createOrUpdate(data.gmd, this.models.gmd),
      publisher_id: await createOrUpdate(data.publisher, this.models.publisher),
      publish_place_id: await createOrUpdate(data.publishPlace, this.models.place),
      frequency_id: await createOrUpdate(data.frequency, this.models.frequency) || 0,
      content_type_id: await createOrUpdate(data.contentType, this.models.contentType),
      media_type_id: await createOrUpdate(data.mediaType, this.models.mediaType),
      carrier_type_id: await createOrUpdate(data.carrierType, this.models.carrierType),
      title: data.title,
      sor: data.statementOfResponsibility,
      edition: data.edition,
      isbn_issn: data.isbnIssn,
      publish_year: data.publishYear,
      collation: data.collation,
      series_title: data.seriesTitle,
      call_number: data.callNumber,
      source: null,
      classification: data.classification,
      notes: data.notes || '',
      image: data.image,
      // file_att: null,
      opac_hide: data.hide ? 1 : 0,
      promoted: data.promoted ? 1 : 0,
      labels: data.labels,
      spec_detail_info: data.specDetailInfo,
      input_date: data.created || new Date(),
      last_update: data.updated || new Date(),
    };
  }

  protected async toData(data: RawBiblioData): Promise<RequiredId<BiblioData>> {
    return {
      id: data.biblio_id,
      language: data.language_id ? await this.models.language.get(data.language_id) : undefined,
      gmd: await maybeGetData(data.gmd_id, this.models.gmd),
      publisher: await maybeGetData(data.publisher_id, this.models.publisher),
      publishPlace: await maybeGetData(data.publish_place_id, this.models.place),
      frequency: await maybeGetData(data.frequency_id, this.models.frequency), // default 0
      contentType: await maybeGetData(data.content_type_id, this.models.contentType),
      mediaType: await maybeGetData(data.media_type_id, this.models.mediaType),
      carrierType: await maybeGetData(data.carrier_type_id, this.models.carrierType),
      title: data.title,
      isbnIssn: data.isbn_issn,
      statementOfResponsibility: data.sor,
      edition: data.edition,
      collation: data.collation,
      seriesTitle: data.series_title,
      callNumber: data.call_number,
      classification: data.classification,
      publishYear: data.publish_year,
      notes: data.notes,
      image: data.image, // varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
      // file_att: string, // varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
      labels: data.labels, // serialised PHP Urg.
      specDetailInfo: data.spec_detail_info,
      hide: !!data.opac_hide,
      promoted: !!data.promoted,
      created: data.input_date,
      updated: data.last_update,
    }
  }
}