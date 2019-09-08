import Knex from 'knex';
import * as fs from 'fs';
import * as path from 'path';

exports.seed = function (knex: Knex) {
  var sql = fs.readFileSync(path.resolve(__dirname, './slims_schema.sql')).toString();
  return knex.raw(sql);
};
