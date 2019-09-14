import { Item, ItemData, ItemSource } from '../src/models/item';
import { createCrudTests } from './crud_helpers';

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

  const items: ItemData[] = [
    emptyItem,
    simpleItem,
  ];

  const duplicates = [
    simpleItem,
  ];

  const seeds = [
    emptyItem,
  ];

  /* eslint-disable-next-line jest/valid-describe */
  describe('abstract crud interface', createCrudTests<ItemData>({
    createModel: db => new Item(db),
    clean: async (knex) => knex('item').delete(),
    seeds,
    create: items,
    duplicates,
  }));
});
