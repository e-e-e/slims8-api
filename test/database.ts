import knexConfig from '../knexfile';
import Knex from 'knex';

export function createDatabase() {
  return Knex(process.env.NODE_ENV === 'travis' ? knexConfig.travis : knexConfig.test);
}