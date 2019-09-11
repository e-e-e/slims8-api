import { Author, AuthorData } from '../src/models/author';
import { createCrudTests } from './crud_helpers';
import { marx, donna, invisibleCollective, frontyard, proudhon } from './fakes/authors';
describe('Author', () => {

  const authors = [
    donna,
    invisibleCollective,
    frontyard,
    marx,
  ];
  const seeds = [proudhon];

  /* eslint-disable-next-line jest/valid-describe */
  describe('basic crud operations', createCrudTests<AuthorData>({
    createModel: (db) => new Author(db),
    clean: async (knex) => knex('mst_author').delete().where('author_id', '>=', 0),
    seeds,
    create: authors,
    duplicates: authors,
  }));
});
