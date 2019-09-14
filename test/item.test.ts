import { Item, ItemData, ItemSource } from '../src/models/item';
import { createCrudTests } from './crud_helpers';
import { Collection } from '../src/models/collection';

describe('Publisher', () => {

  const emptyItem = {
    source: ItemSource.PURCHASE,
  };

  const simpleItem = {
    biblioId: 666,
    callNumber: 'a-call-number',
    itemCode: 'an-item-code',
    inventoryCode: 'an-inventory-code',
    receivedDate: new Date(2019, 4),
    orderNo: 'order number',
    orderDate: new Date(2019, 3),
    site: 'frontyard',
    invoice: 'invoice-data',
    source: ItemSource.GRANT_OR_PRIZE,
    price: 123,
    priceCurrency: 'en',
    invoiceDate: new Date(2019, 3, 2),
  };

  const itemWithCollection = {
    source: ItemSource.PURCHASE,
    collection: {
      name: 'Australia Council'
    }
  };

  const items: ItemData[] = [
    emptyItem,
    simpleItem,
    itemWithCollection,
  ];

  const duplicates = [
    simpleItem,
  ];

  const seeds = [
    emptyItem,
  ];

  /* eslint-disable-next-line jest/valid-describe */
  describe('abstract crud interface', createCrudTests<ItemData>({
    createModel: db => {
      const collection = new Collection(db);
      return new Item(db, { collection });
    },
    clean: async (db) => {
      await db('item').delete();
      await db('mst_coll_type').delete();
    },
    seeds,
    create: items,
    duplicates,
  }));
});
