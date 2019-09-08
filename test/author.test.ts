import { Author, AuthorData, AuthorType } from '../src/models/author';
import { createCrudTests } from './crud_helpers';

describe('Author', () => {

  const marx: AuthorData = {
    name: 'Marx, Karl',
    type: AuthorType.PERSON,
  };
  const donna: AuthorData = {
    name: 'Haraway, Donna',
    year: '1970',
    type: AuthorType.PERSON,
  };
  const invisibleCollective: AuthorData = {
    name: 'The Invisible Collective',
    type: AuthorType.COLLECTIVE,
  };
  const frontyard: AuthorData = {
    name: 'Frontyard Projects Inc',
    type: AuthorType.ORGANISATION,
    authorityList: 'hearsay'
  };
  const authors = [
    donna,
    invisibleCollective,
    frontyard,
    marx,
  ];
  const seeds = [{
    name: 'Proudhon',
    type: AuthorType.PERSON,
  }];

  /* eslint-disable-next-line jest/valid-describe */
  describe('basic crud operations', createCrudTests<AuthorData>({
    createModel: (db) => new Author(db),
    clean: async (knex) => knex('mst_author').delete().where('author_id', '>=', 0),
    seeds,
    create: authors,
    duplicates: authors,
  }));
});
