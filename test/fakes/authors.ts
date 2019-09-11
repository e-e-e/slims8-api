import { AuthorData, AuthorType } from '../../src/models/author';

export const marx: AuthorData = {
  name: 'Marx, Karl',
  type: AuthorType.PERSON,
};

export const donna: AuthorData = {
  name: 'Haraway, Donna',
  year: '1970',
  type: AuthorType.PERSON,
};

export const invisibleCollective: AuthorData = {
  name: 'The Invisible Collective',
  type: AuthorType.COLLECTIVE,
};

export const frontyard: AuthorData = {
  name: 'Frontyard Projects Inc',
  type: AuthorType.ORGANISATION,
  authorityList: 'hearsay'
};

export const proudhon: AuthorData = {
  name: 'Proudhon',
  type: AuthorType.PERSON,
};
