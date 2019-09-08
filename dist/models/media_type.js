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
const mediaTypeTable = 'mst_media_type';
const mediaTypeColumns = {
    id: 'id',
    type: 'media_type',
    code: 'code',
    marcPrefix: 'code2',
    created: 'input_date',
    updated: 'last_update',
};
function toRaw(data) {
    return {
        id: data.id,
        media_type: data.type,
        code: data.code,
        code2: data.marcPrefix,
        input_date: data.created || new Date(),
        last_update: data.updated || new Date(),
    };
}
function toData(data) {
    return {
        id: data.id,
        type: data.media_type,
        code: data.code,
        marcPrefix: data.code2,
        created: data.input_date,
        updated: data.last_update,
    };
}
class MediaType extends abstract_crud_1.AbstractCrudModel {
    constructor(db) {
        super(db, mediaTypeTable, mediaTypeColumns.id);
    }
    toPartialRaw(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                id: data.id,
                media_type: data.type,
                code: data.code,
                code2: data.marcPrefix,
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
exports.MediaType = MediaType;
//# sourceMappingURL=media_type.js.map