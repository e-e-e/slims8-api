import { Data, AbstractCrudModel } from "./abstract_crud";
import { MapDataType } from "./data_types";
import * as Knex from "knex";

type CollectionTypeData = Data & {
  name: string,
};

type LocationData = {
  id: string, // `location_id` varchar(3) COLLATE utf8_unicode_ci NOT NULL,
  name?: string, // `location_name` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
} & Pick<Data, 'created' | 'updated'>;

type ItemStatusData = {
  id: string, // `item_status_id` char(3) COLLATE utf8_unicode_ci NOT NULL,
  name: string, // `item_status_name` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  rules?: string, // `rules` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  noLoan: boolean, // `no_loan` smallint(1) NOT NULL DEFAULT '0',
  skipStockTake: boolean, // `skip_stock_take` smallint(1) NOT NULL DEFAULT '0',
} & Pick<Data, 'created' | 'updated'>;

export enum ItemSource {
  PURCHASE = 0,
  GRANT_OR_PRIZE,
}

export type ItemData = Data & {
  biblioId?: number, // int(11) DEFAULT NULL,
  callNumber?: string, // varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  collType?: CollectionTypeData, // int(3) DEFAULT NULL,
  itemCode?: string, // varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  inventoryCode?: string, // varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  receivedDate?: Date, // date DEFAULT NULL,
  // supplier?: string, // varchar(6) COLLATE utf8_unicode_ci DEFAULT NULL,
  orderNo?: string, // varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  location?: LocationData, // varchar(3) COLLATE utf8_unicode_ci DEFAULT NULL,
  orderDate?: Date, // date DEFAULT NULL,
  itemStatus?: ItemStatusData, // char(3) COLLATE utf8_unicode_ci DEFAULT NULL,
  site?: string, // varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  source: ItemSource, // int(1) NOT NULL DEFAULT '0',
  invoice?: string, // varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  price?: number, // int(11) DEFAULT NULL,
  priceCurrency?: string, // varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  invoiceDate?: Date, // date DEFAULT NULL,
  uid?: number, // int(11) DEFAULT NULL,
};

const itemTable = 'item';
const itemColumns = {
  id: 'item_id', // int(11) NOT NULL AUTO_INCREMENT,
  biblioId: 'biblio_id', // int(11) DEFAULT NULL,
  callNumber: 'call_number', // varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  collType: 'coll_type_id', // int(3) DEFAULT NULL,
  itemCode: 'item_code', // varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  inventoryCode: 'inventory_code', // varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  receivedDate: 'received_date', // date DEFAULT NULL,
  // disabled supply as DB type inconsistent with id of mst_supplier.
  // supplier: 'supplier_id', // varchar(6) COLLATE utf8_unicode_ci DEFAULT NULL,
  orderNo: 'order_no', // varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  location: 'location_id', // varchar(3) COLLATE utf8_unicode_ci DEFAULT NULL,
  orderDate: 'order_date', // date DEFAULT NULL,
  itemStatus: 'item_status_id', // char(3) COLLATE utf8_unicode_ci DEFAULT NULL,
  site: 'site', // varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  source: 'source', // int(1) NOT NULL DEFAULT '0',
  invoice: 'invoice', // varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  price: 'price', // int(11) DEFAULT NULL,
  priceCurrency: 'price_currency', // varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  invoiceDate: 'invoice_date', // date DEFAULT NULL,
  uid: 'uid', // int(11) DEFAULT NULL,
  created: 'input_date', // datetime NOT NULL,
  updated: 'last_update', // datetime DEFAULT NULL,
} as const;

type TableOverride = {
  item_id: number,
  source: number,
  coll_type_id?: number,
  location_id?: string,
  item_status_id?: string,
}

type RawItemData = MapDataType<typeof itemColumns, ItemData, TableOverride>


export class Item extends AbstractCrudModel<ItemData, RawItemData, typeof itemColumns.id>{
  constructor(db: Knex) {
    super(db, itemTable, itemColumns.id);
  }

  protected async toPartialRaw(data: Partial<ItemData>) {
    return {
      item_id: data.id,
      biblio_id: data.biblioId,
      coll_type_id: data.collType ? data.collType.id : undefined,
      location_id: data.location ? data.location.id : undefined,
      item_status_id: data.itemStatus ? data.itemStatus.id : undefined,
      call_number: data.callNumber,
      item_code: data.itemCode,
      inventory_code: data.inventoryCode,
      received_date: data.receivedDate,
      order_no: data.orderNo,
      order_date: data.orderDate,
      site: data.site,
      source: data.source,
      invoice: data.invoice,
      price: data.price,
      price_currency: data.priceCurrency,
      invoice_date: data.invoiceDate,
      uid: data.uid,
    }
  }

  protected async toRaw(data: ItemData) {
    return {
      item_id: data.id,
      biblio_id: data.biblioId,
      coll_type_id: data.collType ? data.collType.id : undefined,
      location_id: data.location ? data.location.id : undefined,
      item_status_id: data.itemStatus ? data.itemStatus.id : undefined,
      call_number: data.callNumber,
      item_code: data.itemCode,
      inventory_code: data.inventoryCode,
      received_date: data.receivedDate,
      order_no: data.orderNo,
      order_date: data.orderDate,
      site: data.site,
      source: data.source,
      invoice: data.invoice,
      price: data.price,
      price_currency: data.priceCurrency,
      invoice_date: data.invoiceDate,
      uid: data.uid,
      input_date: data.created || new Date(),
      last_update: data.updated || new Date(),
    }
  }

  protected async toData(data: RawItemData) {
    return {
      id: data.item_id,
      biblioId: data.biblio_id,
      collType: undefined, // data.coll_type_id,
      location: undefined, //data.location_id,
      itemStatus: undefined, //data.item_status_id,
      callNumber: data.call_number,
      itemCode: data.item_code,
      inventoryCode: data.inventory_code,
      receivedDate: data.received_date,
      orderNo: data.order_no,
      orderDate: data.order_date,
      site: data.site,
      source: data.source,
      invoice: data.invoice,
      price: data.price,
      priceCurrency: data.price_currency,
      invoiceDate: data.invoice_date,
      uid: data.uid,
      created: data.input_date,
      updated: data.last_update,
    }
  }
}
