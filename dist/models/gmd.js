"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_crud_1 = require("./abstract_crud");
const gmdTable = 'mst_gmd';
const gmdColumns = {
    id: 'gmd_id',
    code: 'gmd_code',
    name: 'gmd_name',
    iconImage: 'icon_image',
    created: 'input_date',
    updated: 'last_update',
};
function toRaw(data) {
    return {
        gmd_id: data.id,
        gmd_code: data.code,
        gmd_name: data.name,
        icon_image: data.iconImage,
        input_date: data.created || new Date(),
        last_update: data.updated || new Date(),
    };
}
function toData(data) {
    return {
        id: data.gmd_id,
        code: data.gmd_code,
        name: data.gmd_name,
        iconImage: data.icon_image,
        created: data.input_date,
        updated: data.last_update,
    };
}
// function part<
//   T extends Partial<Record<keyof K, any>>,
//   O extends Record<keyof Invert<K>, any>,
//   K extends Record<string, string>
// >(data: T, map: K) {
//   const o: Partial<O> = {}
//   for (let key in map) {
//     const value = data[key];
//     if (value != undefined) {
//       o[map[key]] = data[key];
//     }
//   }
//   return o;
// }
// const x = part<GmdData, RawGmdData, typeof gmdColumns>({ name: 'hello' }, gmdColumns);
class GeneralMaterialDesignation extends abstract_crud_1.AbstractCrudModel {
    constructor(db) {
        super(db, gmdTable, gmdColumns.id);
    }
    toPartialRaw(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                gmd_id: data.id,
                gmd_code: data.code,
                gmd_name: data.name,
                icon_image: data.iconImage,
                input_date: data.created,
                last_update: data.updated,
            };
        });
    }
    toRaw(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return toRaw(data);
        });
    }
    toData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return toData(data);
        });
    }
}
exports.GeneralMaterialDesignation = GeneralMaterialDesignation;
//# sourceMappingURL=gmd.js.map