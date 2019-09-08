export class UnreachableError extends Error {
  /** @param x an unreachable value */
  constructor(x: never) {
    super(`unhandled case: ${JSON.stringify(x)}`);
  }
}

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & { [F in K]-?: Exclude<T[F], undefined> };

// export type WithPartialIds<T extends Data> = PartialBy<{
//   [K in keyof T]: Extract<T[K], Data> extends never ? T[K] : WithPartialIds<Extract<T[K], Data>>;
// }, 'id'>

// export type WithNestedPartialIds<T extends Data> = {
//   [K in keyof T]: Extract<T[K], Data> extends never ? T[K] : WithPartialIds<Extract<T[K], Data>>;
// };


/** 
 * Convert a map type { [key]: value } into an map of key/value types.
 * For example, `{ A: 'B' }` becomes `{ A: { key: 'A', value: 'B' } }`.
 */
type KeyValuePairs<T extends Record<PropertyKey, PropertyKey>> = {
  [K in keyof T]: { key: K, value: T[K] }
}[keyof T]

/**
 * Inverts a type map.
 * For example, `{ foo: 'bar' }` becomes `{ bar: 'foo'}`.
 */
export type Invert<T extends Record<PropertyKey, PropertyKey>> = {
  [K in KeyValuePairs<T>['value']]: Extract<KeyValuePairs<T>, { value: K }>['key']
}

/**
 * Replace the types of keys in T with matching type in the LookUp record.
 * 
 * @example
 * 
 * type Foo = { A: 'B' };
 * type LookUp = { 'B': number };
 * const foo: MatchKeyType<Foo, LookUp> = { A: 123 };
 */
type MatchKeyType<T extends Record<PropertyKey, any>, LookUp extends Record<PropertyKey, any>> = {
  [K in KeyValuePairs<T>['key']]: LookUp[Extract<KeyValuePairs<T>, { key: K }>['value']]
};

/**
 * Create an new type from a type and a key map. 
 * Where C, is a key name map between the source datatype T and the new type.
 * O represents a key value map of overrides to be applied to the new type
 * where the type of T is not the desire type.
 * 
 * @example
 * 
 * const keyNameMap = {
 *   value: 'new_value',
 *   name: 'new_name',
 * } as const;
 * type DataType = {
 *   value: number,
 *   name: string,
 * };
 * type NewDataType = MapDataType<typeof keyNameMap, DataType, { new_name: number }>; 
 * 
 * const foo: NewDataType = {
 *   new_value: 1,
 *   new_name: 2,
 * };
 */
export type MapDataType<
  C extends Record<keyof T, string>,
  T extends Record<PropertyKey, any>,
  O extends Partial<Record<keyof Invert<C>, any>> = {},
  > = Omit<
    MatchKeyType<Invert<C>, T>,
    keyof O
  > & O;

// export type ItemRecord = Data & {
//   bibio?: number, // `biblio_id` int(11) DEFAULT NULL,
//   callNumber?: string, // `call_number` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
//   collectionType?: number, // `coll_type_id` int(3) DEFAULT NULL,
//   itemCode?: string, // `item_code` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
//   inventoryCode?: string, // `inventory_code` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
//   receivedDate?: Date, // `received_date` date DEFAULT NULL,
//   supplierId?: string, // `supplier_id` varchar(6) COLLATE utf8_unicode_ci DEFAULT NULL,
//   orderNumber?: string, // `order_no` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
//   locationId?: string, // `location_id` varchar(3) COLLATE utf8_unicode_ci DEFAULT NULL,
//   orderDate?: Date, // `order_date` date DEFAULT NULL,
//   itemStatusId?: string, // `item_status_id` char(3) COLLATE utf8_unicode_ci DEFAULT NULL,
//   site?: string, // `site` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
//   source: number, // 0 // `source` int(1) NOT NULL DEFAULT '0',
//   invoice?: string, // `invoice` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
//   price?: number, // `price` int(11) DEFAULT NULL,
//   price_currency?: string, // `price_currency` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
//   invoiceDate: string, // `invoice_date` date DEFAULT NULL,
//   uid?: number, // `uid` int(11) DEFAULT NULL,
// }
