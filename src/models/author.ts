import * as Knex from 'knex'
import { MapDataType, PartialBy, UnreachableError } from './data_types';
import { AbstractCrudModel, Data } from './abstract_crud';

export enum AuthorType {
  PERSON,
  ORGANISATION,
  COLLECTIVE,
}

type RawAuthorType = 'o' | 'p' | 'c';

export type AuthorData = Data & {
  name: string,
  year?: string,
  type: AuthorType,
  authorityList?: string,
}

const authorTable = `mst_author`;
const authorColumns = {
  id: 'author_id', // int(11) NOT NULL AUTO_INCREMENT,
  name: 'author_name', // varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  year: `author_year`, // varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  type: `authority_type`, // enum('p','o','c') COLLATE utf8_unicode_ci DEFAULT 'p',
  authorityList: `auth_list`, // varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL
  created: `input_date`, //  date NOT NULL,
  updated: `last_update` // date DEFAULT NULL,
} as const;

type TableOverrides = {
  'author_id': number,
  'authority_type': RawAuthorType;
}

type RawAuthorData = MapDataType<typeof authorColumns, AuthorData, TableOverrides>

function toRawAuthorType(type: AuthorType): RawAuthorType {
  switch (type) {
    case AuthorType.COLLECTIVE: return 'c';
    case AuthorType.PERSON: return 'p';
    case AuthorType.ORGANISATION: return 'o';
    default:
      throw new UnreachableError(type);
  }
}

function toAuthorType(type: RawAuthorType): AuthorType {
  switch (type) {
    case 'c': return AuthorType.COLLECTIVE;
    case 'p': return AuthorType.PERSON;
    case 'o': return AuthorType.ORGANISATION;
    default:
      throw new UnreachableError(type);
  }
}

function toRaw(author: PartialBy<AuthorData, 'id'>): PartialBy<RawAuthorData, 'author_id'> {
  return {
    author_id: author.id,
    author_year: author.year,
    author_name: author.name,
    authority_type: toRawAuthorType(author.type),
    auth_list: author.authorityList,
    last_update: author.updated || new Date(),
    input_date: author.created || new Date(),
  };
}

function toData(data: RawAuthorData) {
  return {
    id: data.author_id,
    name: data.author_name,
    year: data.author_year,
    authorityList: data.auth_list,
    type: toAuthorType(data.authority_type),
    created: data.input_date ? new Date(data.input_date) : undefined,
    updated: data.last_update ? new Date(data.last_update) : undefined,
  }
}

export class Author extends AbstractCrudModel<AuthorData, RawAuthorData, 'author_id'> {
  constructor(db: Knex) {
    super(db, authorTable, authorColumns.id);
  }

  protected async toPartialRaw(data: Partial<AuthorData>) {
    return {
      author_id: data.id,
      author_year: data.year,
      author_name: data.name,
      authority_type: data.type != undefined ? toRawAuthorType(data.type) : undefined,
      auth_list: data.authorityList,
    };
  }

  protected async toRaw(data: PartialBy<AuthorData, 'id'>) {
    return toRaw(data);
  }

  protected async toData(data: RawAuthorData) {
    return toData(data);
  }

  async books(authorId: number) {
    throw new Error('Not implemented yet')
  }
}