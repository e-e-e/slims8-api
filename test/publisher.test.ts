import { Publisher, PartialPublisherData, PublisherData } from '../src/models/publisher';
import { createCrudTests } from './crud_helpers';

describe('Publisher', () => {
  const publishers: PartialPublisherData[] = [{
    name: 'MIT',
  }, {
    name: 'Lazy Fascist Press'
  }];

  const seeds = [{
    name: 'Oxford Press',
  }, {
    name: 'Uh Books',
  }]

  describe('abstract crud interface', createCrudTests<PublisherData>({
    createModel: db => new Publisher(db),
    clean: async (knex) => knex(`mst_publisher`).delete().where('publisher_id', '>=', 0),
    seeds,
    create: publishers,
    duplicates: publishers,
  }))
});
