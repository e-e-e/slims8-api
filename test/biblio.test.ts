import { Biblio, BiblioData } from '../src/models/biblio';
import { createCrudTests } from './crud_helpers';
import { Publisher } from '../src/models/publisher';
import { Place } from '../src/models/place';
import { createDatabase } from './database';
import Knex from 'knex';
import { GeneralMaterialDesignation } from '../src/models/gmd';
import { ContentType } from '../src/models/content_type';
import { CarrierType } from '../src/models/carrier_type';
import { MediaType } from '../src/models/media_type';
import { Frequency } from '../src/models/frequency';
import { Language } from '../src/models/language';

describe('Biblio', () => {
  const simple: BiblioData = { title: 'What is Property?' };
  const withPublisher: BiblioData = { title: 'Animal Money', publisher: { name: 'Lazy Fascist Press' } };
  const withGmd: BiblioData = { title: 'Capital', gmd: { name: 'Text', code: 'TE' } };
  const withCarrierType: BiblioData = {
    title: 'Capital',
    carrierType: { type: 'computer disc', code: 'cd', marcPrefix: 'd' }
  };
  const withContentType: BiblioData = {
    title: 'Capital',
    contentType: { type: 'text', code: 'txt', marcPrefix: 't' }
  };
  const withMediaType: BiblioData = {
    title: 'Capital',
    mediaType: { type: 'unmediated', code: 'n', marcPrefix: 't' }
  };
  const withFrequency: BiblioData = {
    title: 'Commune Magazine',
    frequency: {
      frequency: 'monthly',
      languagePrefix: 'en',
      timeIncrement: 3,
      timeUnit: 'month',
    },
  }
  const withLanguage: BiblioData = {
    title: 'The Cultural Politics of Emotions',
    language: {
      id: 'en',
      name: 'English'
    }
  }
  const books = [
    simple,
    withPublisher,
    withGmd,
    withCarrierType,
    withContentType,
    withMediaType,
    withFrequency,
    withLanguage,
  ];

  const seeds = [{
    title: 'seeds',
  }, {
    title: 'Fuck Neoliberalism',
    publishYear: '2018',
  },
  {
    title: 'Architecture & Violence',
    publishYear: '2012',
    isbnIssn: '978-8492861736',
  }]

  const createModel = (db: Knex) => {
    const publisher = new Publisher(db);
    const gmd = new GeneralMaterialDesignation(db);
    const place = new Place(db);
    const contentType = new ContentType(db);
    const carrierType = new CarrierType(db);
    const mediaType = new MediaType(db);
    const frequency = new Frequency(db);
    const language = new Language(db);
    return new Biblio(db, {
      publisher,
      gmd,
      place,
      contentType,
      carrierType,
      mediaType,
      frequency,
      language,
    });
  }

  describe('abstract crud interface', createCrudTests<BiblioData>({
    createModel,
    clean: async (knex) => {
      await knex(`biblio`).delete().where('biblio_id', '>=', 0);
      await knex(`mst_publisher`).delete().where('publisher_id', '>=', 0)
    },
    seeds,
    create: books,
  }))

  describe('specifics', () => {
    let knex: Knex;
    let model: Biblio;

    beforeAll(async () => {
      knex = createDatabase();
      await knex.seed.run()
      model = createModel(knex);
    })

    afterAll(async () => {
      await knex.destroy();
    });

    it('kkk', async () => {

    });
  })
});
