/* eslint-disable @typescript-eslint/camelcase */
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
import { topicWithClassification, topicWithType, simpleTopic } from './fakes/topics';

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
    await db('biblio_topic').delete();
    await db('mst_topic').delete();
  };

  /* eslint-disable-next-line jest/valid-describe */
  describe('abstract crud interface', createCrudTests<BiblioData>({
    createModel: createModelForCrud,
    clean,
    seeds,
    create: books,
  }));

  // TODO: Can these relational tests be made generic
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
        });
      });

      it('creates new author if does not exist (without id specified)', async () => {
        const bookId = await model.create(simple);
        if (!bookId) throw new Error('Biblio creation failed');
        await model.addAuthor(bookId, proudhon, 2);
        const authors = await author.all();
        const results = await db('biblio_author').select();
        expect(results).toHaveLength(1);
        expect(authors).toHaveLength(1);
        expect(results[0]).toEqual({
          biblio_id: bookId,
          author_id: authors[0].id,
          level: 2,
        });
      });

      it('does not create author if author already exists, but links existing author', async () => {
        const bookId = await model.create(simple);
        const personId = await author.create(marx);
        if (!bookId) throw new Error('Biblio creation failed');
        await model.addAuthor(bookId, marx, 1);
        const authors = await author.all();
        const results = await db('biblio_author').select();
        expect(results).toHaveLength(1);
        expect(authors).toHaveLength(1);
        expect(results[0]).toEqual({
          biblio_id: bookId,
          author_id: personId,
          level: 1,
        });
      });

      it('creates new author if does not exist (with id specified)', async () => {
        const bookId = await model.create(simple);
        if (!bookId) throw new Error('Biblio creation failed');
        const donnaWithId = { ...donna, id: 1234 };
        await model.addAuthor(bookId, donnaWithId, 2);
        const authors = await author.all();
        expect(authors).toHaveLength(1);
        const results = await db('biblio_author').select();
        expect(results).toHaveLength(1);
        expect(results[0]).toEqual({
          biblio_id: bookId,
          author_id: authors[0].id,
          level: 2,
        });
        expect(authors[0].id).toEqual(1234);
      });

      it('throws error if author id does not exist', async () => {
        const bookId = await model.create(simple);
        if (!bookId) throw new Error('Biblio creation failed');
        await expect(model.addAuthor(bookId, 1000, 1)).rejects.toThrow();
      });

      it('throws error is book id is undefined', async () => {
        const authorId = await author.create(invisibleCollective);
        if (!authorId) throw new Error('Author creation failed');
        await expect(model.addAuthor(100000, authorId, 1)).rejects.toThrow();
      });

      it('does nothing if relation already exists', async () => {
        const bookId = await model.create(simple);
        const authorId = await author.create(proudhon);
        if (!bookId) throw new Error('Biblio creation failed');
        if (!authorId) throw new Error('Author creation failed');
        await model.addAuthor(bookId, authorId, 1);
        await model.addAuthor(bookId, authorId, 1);
        const results = await db('biblio_author').select();
        expect(results).toHaveLength(1);
        expect(results[0]).toEqual({
          biblio_id: bookId,
          author_id: authorId,
          level: 1,
        });
      })
    });

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
    });

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
        await expect(author.get(person)).resolves.toEqual(expect.objectContaining(marx));
      });
    });

    describe('addTopic', () => {

      it('adds new topic associated to biblio id', async () => {
        const bookId = await model.create(simple);
        const subject = await topic.create(simpleTopic);
        if (!bookId || !subject) throw new Error('biblio or topic creation failed');
        await model.addTopic(bookId, subject, 1);
        const results = await db('biblio_topic').select();
        expect(results).toHaveLength(1);
        expect(results[0]).toEqual({
          biblio_id: bookId,
          topic_id: subject,
          level: 1,
        });
      });

      it('creates new topic if does not exist (without id specified)', async () => {
        const bookId = await model.create(simple);
        if (!bookId) throw new Error('Biblio creation failed');
        await model.addTopic(bookId, topicWithType, 2);
        const topics = await topic.all();
        const results = await db('biblio_topic').select();
        expect(results).toHaveLength(1);
        expect(topics).toHaveLength(1);
        expect(results[0]).toEqual({
          biblio_id: bookId,
          topic_id: topics[0].id,
          level: 2,
        });
      });

      it('does not create topic if topic already exists, but links existing author', async () => {
        const bookId = await model.create(simple);
        const topicId = await topic.create(topicWithType);
        if (!bookId) throw new Error('Biblio creation failed');
        await model.addTopic(bookId, topicWithType, 1);
        const topics = await topic.all();
        const results = await db('biblio_topic').select();
        expect(results).toHaveLength(1);
        expect(topics).toHaveLength(1);
        expect(results[0]).toEqual({
          biblio_id: bookId,
          topic_id: topicId,
          level: 1,
        });
      });

      it('creates new topic if does not exist (with id specified)', async () => {
        const bookId = await model.create(simple);
        if (!bookId) throw new Error('Biblio creation failed');
        const simpleTopicWithId = { ...simpleTopic, id: 1234 };
        await model.addTopic(bookId, simpleTopicWithId, 2);
        const topics = await topic.all();
        expect(topics).toHaveLength(1);
        const results = await db('biblio_topic').select();
        expect(results).toHaveLength(1);
        expect(results[0]).toEqual({
          biblio_id: bookId,
          topic_id: topics[0].id,
          level: 2,
        });
        expect(topics[0].id).toEqual(1234);
      });

      it('throws error if topic id does not exist', async () => {
        const bookId = await model.create(simple);
        if (!bookId) throw new Error('Biblio creation failed');
        await expect(model.addTopic(bookId, 1000, 1)).rejects.toThrow();
      });

      it('throws error is book id is undefined', async () => {
        const topicId = await topic.create(simpleTopic);
        if (!topicId) throw new Error('Topic creation failed');
        await expect(model.addTopic(100000, topicId, 1)).rejects.toThrow();
      });
      it('does nothing if relation already exists', async () => {
        const bookId = await model.create(simple);
        const topicId = await topic.create(simpleTopic);
        if (!bookId) throw new Error('Biblio creation failed');
        if (!topicId) throw new Error('Topic creation failed');
        await model.addTopic(bookId, topicId, 1);
        await model.addTopic(bookId, topicId, 1);
        const results = await db('biblio_topic').select();
        expect(results).toHaveLength(1);
        expect(results[0]).toEqual({
          biblio_id: bookId,
          topic_id: topicId,
          level: 1,
        });
      })
    });

    describe('getTopics', () => {
      it('returns an empty array if no topics associated with biblio id', async () => {
        const bookId = await model.create(simple);
        if (!bookId) throw new Error('Biblio creation failed');
        const topics = await model.getTopics(122);
        expect(topics).toEqual([]);
      });
      it('returns an ordered array of topics', async () => {
        const bookId = await model.create(simple);
        if (!bookId) throw new Error('Biblio creation failed');
        await model.addTopic(bookId, simpleTopic, 1);
        await model.addTopic(bookId, topicWithType, 2);
        await model.addTopic(bookId, topicWithClassification, 2);
        const topics = await model.getTopics(bookId);
        expect(topics).toHaveLength(3);
        expect(topics[0]).toEqual(expect.objectContaining(simpleTopic));
        expect(topics[1]).toEqual(expect.objectContaining(topicWithType));
        expect(topics[2]).toEqual(expect.objectContaining(topicWithClassification));
      });
    });

    describe('removeTopic', () => {
      it('removes topic association', async () => {
        const bookId = await model.create(simple);
        const person = await topic.create(simpleTopic);
        if (!bookId || !person) throw new Error('biblio or topic creation failed');
        await model.addTopic(bookId, person, 1);
        let results = await db('biblio_topic').select();
        expect(results).toHaveLength(1);
        expect(results[0]).toEqual({
          biblio_id: bookId,
          topic_id: person,
          level: 1,
        });
        await model.removeTopic(bookId, person);
        results = await db('biblio_topic').select();
        expect(results).toHaveLength(0);
      });
      it('does not remove the topic from the database', async () => {
        const bookId = await model.create(simple);
        const person = await topic.create(simpleTopic);
        if (!bookId || !person) throw new Error('biblio or topic creation failed');
        await model.addTopic(bookId, person, 1);
        await model.removeTopic(bookId, person);
        const results = await db('biblio_topic').select();
        expect(results).toHaveLength(0);
        await expect(topic.get(person)).resolves.toEqual(expect.objectContaining(simpleTopic));
      });
    });
  });
});
