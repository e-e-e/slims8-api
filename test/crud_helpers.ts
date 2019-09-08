import { createDatabase } from './database';
import Knex from 'knex'
// import { PartialBy, WithPartialIds, WithNestedPartialIds } from '../src/models/data_types';
import { Model, Data, RequiredId } from '../src/models/abstract_crud';

function expectObjectContainingNested(obj: Record<string, any>) {
  const x = Object.keys(obj).reduce((o: Record<string, any>, k: string) => {
    o[k] = typeof obj[k] === 'object' ? expect.objectContaining(obj[k] as {}) : obj[k];
    return o;
  }, {});
  return expect.objectContaining(x)
}

export function createCrudTests<T extends Data>({
  createModel,
  clean,
  seeds,
  create,
  find,
  duplicates,
}: {
  createModel: (knex: Knex) => Model<T>,
  clean?: (knex: Knex) => Promise<any>,
  seeds: T[],
  create: T[],
  find?: Partial<T>[],
  duplicates?: T[],
}) {
  return () => {
    let knex: Knex;
    let model: Model<T>;

    const seedsWithIds = seeds.map((seed, i) => ({
      ...seed,
      id: 100 + i,
    })) as RequiredId<T>[];

    beforeAll(async () => {
      knex = createDatabase();
      await knex.seed.run()
      model = createModel(knex);
    })

    afterAll(async () => {
      await knex.destroy();
    });

    beforeEach(async () => {
      for (let seed of seedsWithIds) {
        await model.create(seed);
      }
    });

    afterEach(async () => {
      clean && await clean(knex);
    });

    describe('create', () => {
      test.each(create)('create %o', async (data) => {
        const id = await model.create(data);
        expect(id).toBeGreaterThan(0);
      });

      if (duplicates) {
        test.each(duplicates)('throws error on duplicates %o', async (data) => {
          const id = await model.create(data);
          expect(id).toBeGreaterThan(0);
          expect(model.create(data)).rejects.toThrowError(/ER_DUP_ENTRY/);
        })
      }
    });

    describe('get', () => {
      test.each(seedsWithIds)(`get %o`, async (data) => {
        if (data.id === undefined) return fail('seeds should have id');
        const result = await model.get(data.id);
        expect(result).toEqual(expect.objectContaining(data));
        expect(result).toHaveProperty('created', expect.any(Date));
        expect(result).toHaveProperty('updated', expect.any(Date));
      });
    });

    describe('all', () => {

      it('fetches all items', async () => {
        const result = await model.all();
        expect(result).toHaveLength(seedsWithIds.length);
        expect(result).toEqual(
          expect.arrayContaining(seedsWithIds.map(data => expect.objectContaining(data)))
        );
      });

    });

    describe('find', () => {
      test.each(find || seeds)('finds item %o', async (searchData) => {
        const result = await model.find(searchData);
        expect(result.length).toBeGreaterThan(0);
        result.forEach(res => expect(res).toEqual(expectObjectContainingNested(searchData)))
      })
    });

    describe('update', () => {
      describe.each(seedsWithIds)('updates item %o', (seed) => {
        test.each(create)('with %o', async (data) => {
          const newData: RequiredId<T> = {
            ...data,
            id: seed.id,
          }
          const effected = await model.update(newData);
          expect(effected).toEqual(1);
          expect(await model.get(seed.id)).toEqual(expectObjectContainingNested(newData))
        })
      });

      it('returns 0 when no records are updated', async () => {
        const id = 1000000;
        const result = await model.update({
          ...seedsWithIds[0],
          id,
        } as RequiredId<T>)
        expect(result).toEqual(0);
        expect(await model.get(id)).toBeUndefined();
      })
    });

    describe('delete', () => {
      test.each(seedsWithIds)('delete %o', async (data) => {
        expect(await model.get(data.id)).toEqual(expect.objectContaining(data));
        const effected = await model.delete(data.id);
        expect(effected).toBe(1);
        expect(await model.get(data.id)).toBeUndefined();
      });

      it('returns 0 when no records are deleted', async () => {
        const id = 1000000;
        expect(await model.delete(id)).toEqual(0);

      });
    });
  }
}