import { GeneralMaterialDesignation, GmdData } from '../src/models/gmd';
import { createCrudTests } from './crud_helpers';

describe('GeneralMaterialDesignation', () => {
  const gmd: GmdData[] = [{
    name: 'Art Original',
    code: 'AR',
  }, {
    name: 'Text',
    // code: 'TE',
  }];

  const seeds = [{
    name: 'Manuscript',
  }, {
    name: 'CD',
    code: 'CD'
  }];

  /* eslint-disable-next-line jest/valid-describe */
  describe('abstract crud interface', createCrudTests<GmdData>({
    createModel: db => new GeneralMaterialDesignation(db),
    clean: async (knex) => knex('mst_gmd').delete().where('gmd_id', '>=', 0),
    seeds,
    create: gmd,
    duplicates: gmd,
  }));
});
