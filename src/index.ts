import Knex, { Config } from 'knex';
import { Biblio } from './models/biblio';
import { Author } from './models/author';
import { Topic } from './models/topic';
import { Publisher } from './models/publisher';
import { GeneralMaterialDesignation } from './models/gmd';
import { Place } from './models/place';
import { ContentType } from './models/content_type';
import { CarrierType } from './models/carrier_type';
import { MediaType } from './models/media_type';
import { Frequency } from './models/frequency';
import { Language } from './models/language';
import { Collection } from './models/collection';
import { Item } from './models/item';

interface SlimsApi {
  readonly publisher: Publisher;
  readonly gmd: GeneralMaterialDesignation;
  readonly place: Place;
  readonly contentType: ContentType;
  readonly carrierType: CarrierType;
  readonly mediaType: MediaType;
  readonly frequency: Frequency;
  readonly language: Language;
  readonly biblio: Biblio;
  readonly author: Author;
  readonly topic: Topic;
  readonly collection: Collection;
  readonly item: Item;
  readonly close: () => Promise<void>;
}

export function create(connection: Config): SlimsApi {
  const db = Knex(connection);
  const publisher = new Publisher(db);
  const gmd = new GeneralMaterialDesignation(db);
  const place = new Place(db);
  const contentType = new ContentType(db);
  const carrierType = new CarrierType(db);
  const mediaType = new MediaType(db);
  const frequency = new Frequency(db);
  const language = new Language(db);
  const author = new Author(db);
  const topic = new Topic(db);
  const biblio = new Biblio(db, {
    publisher,
    gmd,
    place,
    contentType,
    carrierType,
    mediaType,
    frequency,
    language,
    author,
    topic,
  });
  const collection = new Collection(db);
  const item = new Item(db, { collection });

  return {
    biblio,
    author,
    publisher,
    gmd,
    place,
    contentType,
    carrierType,
    mediaType,
    frequency,
    language,
    topic,
    item,
    collection,
    close: () => db.destroy(),
  };
}
