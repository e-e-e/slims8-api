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
const languageTable = 'mst_language';
const languageColumns = {
    id: 'language_id',
    name: 'language_name',
    created: 'input_date',
    updated: 'last_update',
};
class Language {
    constructor(db) {
        this.db = db;
        this.table = languageTable;
        this.idColumn = languageColumns.id;
    }
    toPartialRaw(data) {
        return {
            language_id: data.id,
            language_name: data.name,
        };
    }
    toRaw(data) {
        return {
            language_id: data.id,
            language_name: data.name,
            input_date: data.created || new Date(),
            last_update: data.updated || new Date(),
        };
    }
    toData(data) {
        return {
            id: data.language_id,
            name: data.language_name,
            created: data.input_date,
            updated: data.last_update,
        };
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.db(this.table).insert(yield this.toRaw(data));
            return results.length ? results[0] : undefined;
        });
    }
    ;
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.db(this.table)
                .select()
                .where(this.idColumn, id);
            return results.length ? yield this.toData(results[0]) : undefined;
        });
    }
    ;
    all(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = this.db(this.table).select();
            if (options) {
                query.limit(options.limit);
                options.offset && query.offset(options.offset);
            }
            const results = yield query;
            return Promise.all(results.map(d => this.toData(d)));
        });
    }
    ;
    find(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.db(this.table)
                .select()
                .where(this.toPartialRaw(data));
            return Promise.all(results.map(d => this.toData(d)));
        });
    }
    ;
    update(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db(this.table)
                .update(yield this.toRaw(data))
                .where(this.idColumn, data.id);
        });
    }
    ;
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db(this.table)
                .delete()
                .where(this.idColumn, id);
        });
    }
    ;
}
exports.Language = Language;
//# sourceMappingURL=language.js.map