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
import { Author } from '../src/models/author';
import { Topic } from '../src/models/topic';
import { marx, donna, invisibleCollective, frontyard, proudhon } from './fakes/authors';
import { createMockInstance } from './create_mock_instance';

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
  };
  const withLanguage: BiblioData = {
    title: 'The Cultural Politics of Emotions',
    language: {
      id: 'en',
      name: 'English'
    }
  };
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
  }];

  const createModelForCrud = (db: Knex) => {
    const publisher = new Publisher(db);
    const gmd = new GeneralMaterialDesignation(db);
    const place = new Place(db);
    const contentType = new ContentType(db);
    const carrierType = new CarrierType(db);
    const mediaType = new MediaType(db);
    const frequency = new Frequency(db);
    const language = new Language(db);
    const author = createMockInstance(Author);
    const topic = createMockInstance(Topic);
    return new Biblio(db, {
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
  };

  const clean = async (db: Knex) => {
    await db('biblio').delete();
    await db('mst_publisher').delete();
    await db('mst_frequency').delete();
    await db('mst_place').delete();
    await db('biblio_author').delete();
    await db('mst_author').delete();
  }

  /* eslint-disable-next-line jest/valid-describe */
  describe('abstract crud interface', createCrudTests<BiblioData>({
    createModel: createModelForCrud,
    clean,
    seeds,
    create: books,
  }));

  describe('relational operations', () => {
    let db: Knex;
    let model: Biblio;
    let author: Author;
    let topic: Topic;

    beforeAll(async () => {
      db = createDatabase();
      await db.seed.run();
      const publisher = new Publisher(db);
      const gmd = new GeneralMaterialDesignation(db);
      const place = new Place(db);
      const contentType = new ContentType(db);
      const carrierType = new CarrierType(db);
      const mediaType = new MediaType(db);
      const frequency = new Frequency(db);
      const language = new Language(db);
      author = new Author(db);
      topic = new Topic(db);
      model = new Biblio(db, {
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
    });

    afterAll(async () => {
      await db.destroy();
    });

    afterEach(async () => {
      await clean(db);
    });

    describe('addAuthor', () => {

      it('adds new author associated to biblio id', async () => {
        const bookId = await model.create(simple);
        const person = await author.create(marx);
        if (!bookId || !person) throw new Error('biblio or author creation failed');
        await model.addAuthor(bookId, person, 1);
        const results = await db('biblio_author').select();
        expect(results).toHaveLength(1);
        expect(results[0]).toEqual({
          biblio_id: bookId,
          author_id: person,
          level: 1,
        })
      });

      it('creates new author if does not exist (without id specified)', async () => {
        const bookId = await model.create(simple);
        if (!bookId) throw new Error('Biblio creation failed');
        await model.addAuthor(bookId!, proudhon, 2);
        const authors = await author.all();
        const results = await db('biblio_author').select();
        expect(results).toHaveLength(1);
        expect(authors).toHaveLength(1);
        expect(results[0]).toEqual({
          biblio_id: bookId,
          author_id: authors[0].id,
          level: 2,
        })
      });

      it('creates new author if does not exist (with id specified)', async () => {
        const bookId = await model.create(simple);
        if (!bookId) throw new Error('Biblio creation failed');
        const donnaWithId = { ...donna, id: 1234 };
        await model.addAuthor(bookId!, donnaWithId, 2);
        const authors = await author.all();
        expect(authors).toHaveLength(1);
        const results = await db('biblio_author').select();
        expect(results).toHaveLength(1);
        expect(results[0]).toEqual({
          biblio_id: bookId,
          author_id: authors[0].id,
          level: 2,
        })
        expect(authors[0].id).toEqual(1234);
      });

      it('throws error if author id does not exist', async () => {
        const bookId = await model.create(simple);
        if (!bookId) throw new Error('Biblio creation failed');
        expect(model.addAuthor(bookId, 1000, 1)).rejects.toThrowError();
      });

      it('throws error is book id is undefined', async () => {
        const authorId = await author.create(invisibleCollective);
        if (!authorId) throw new Error('Author creation failed');
        expect(model.addAuthor(100000, authorId, 1)).rejects.toThrowError();
      });
    })

    describe('getAuthors', () => {
      it('returns an empty array if no authors associated with biblio id', async () => {
        const bookId = await model.create(simple);
        if (!bookId) throw new Error('Biblio creation failed');
        const authors = await model.getAuthors(122);
        expect(authors).toEqual([]);
      });
      it('returns an ordered array of authors', async () => {
        const bookId = await model.create(simple);
        if (!bookId) throw new Error('Biblio creation failed');
        await model.addAuthor(bookId, marx, 1);
        await model.addAuthor(bookId, donna, 2);
        await model.addAuthor(bookId, frontyard, 2);
        const authors = await model.getAuthors(bookId);
        expect(authors).toHaveLength(3);
        expect(authors[0]).toEqual(expect.objectContaining(marx));
        expect(authors[1]).toEqual(expect.objectContaining(donna));
        expect(authors[2]).toEqual(expect.objectContaining(frontyard));
      });
    })

    describe('removeAuthor', () => {
      it('removes author association', async () => {
        const bookId = await model.create(simple);
        const person = await author.create(marx);
        if (!bookId || !person) throw new Error('biblio or author creation failed');
        await model.addAuthor(bookId, person, 1);
        let results = await db('biblio_author').select();
        expect(results).toHaveLength(1);
        expect(results[0]).toEqual({
          biblio_id: bookId,
          author_id: person,
          level: 1,
        });
        await model.removeAuthor(bookId, person);
        results = await db('biblio_author').select();
        expect(results).toHaveLength(0);
      });
      it('does not remove the author from the database', async () => {
        const bookId = await model.create(simple);
        const person = await author.create(marx);
        if (!bookId || !person) throw new Error('biblio or author creation failed');
        await model.addAuthor(bookId, person, 1);
        await model.removeAuthor(bookId, person);
        const results = await db('biblio_author').select();
        expect(results).toHaveLength(0);
        expect(author.get(person)).resolves.toEqual(expect.objectContaining(marx))
      })
    })
  });
});
