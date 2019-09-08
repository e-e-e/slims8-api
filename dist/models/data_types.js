"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UnreachableError extends Error {
    /** @param x an unreachable value */
    constructor(x) {
        super(`unhandled case: ${JSON.stringify(x)}`);
    }
}
exports.UnreachableError = UnreachableError;
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
//# sourceMappingURL=data_types.js.map