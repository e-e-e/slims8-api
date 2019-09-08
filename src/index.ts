import Knex, { Config } from 'knex';
import { Biblio } from './models/biblio';


export class SlimsApi {
  readonly biblio = new Biblio(this.db);
  constructor(private readonly db: Knex) { }
};

export function createSlimsApi(connection: Config) {
  const database = Knex(connection);
  return new SlimsApi(database);
}
