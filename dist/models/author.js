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
const data_types_1 = require("./data_types");
const abstract_crud_1 = require("./abstract_crud");
var AuthorType;
(function (AuthorType) {
    AuthorType[AuthorType["PERSON"] = 0] = "PERSON";
    AuthorType[AuthorType["ORGANISATION"] = 1] = "ORGANISATION";
    AuthorType[AuthorType["COLLECTIVE"] = 2] = "COLLECTIVE";
})(AuthorType = exports.AuthorType || (exports.AuthorType = {}));
const authorTable = `mst_author`;
const authorColumns = {
    id: 'author_id',
    name: 'author_name',
    year: `author_year`,
    type: `authority_type`,
    authorityList: `auth_list`,
    created: `input_date`,
    updated: `last_update` // date DEFAULT NULL,
};
function toRawAuthorType(type) {
    switch (type) {
        case AuthorType.COLLECTIVE: return 'c';
        case AuthorType.PERSON: return 'p';
        case AuthorType.ORGANISATION: return 'o';
        default:
            throw new data_types_1.UnreachableError(type);
    }
}
function toAuthorType(type) {
    switch (type) {
        case 'c': return AuthorType.COLLECTIVE;
        case 'p': return AuthorType.PERSON;
        case 'o': return AuthorType.ORGANISATION;
        default:
            throw new data_types_1.UnreachableError(type);
    }
}
function toRaw(author) {
    return {
        author_id: author.id,
        author_year: author.year,
        author_name: author.name,
        authority_type: toRawAuthorType(author.type),
        auth_list: author.authorityList,
        last_update: author.updated || new Date(),
        input_date: author.created || new Date(),
    };
}
function toData(data) {
    return {
        id: data.author_id,
        name: data.author_name,
        year: data.author_year,
        authorityList: data.auth_list,
        type: toAuthorType(data.authority_type),
        created: data.input_date ? new Date(data.input_date) : undefined,
        updated: data.last_update ? new Date(data.last_update) : undefined,
    };
}
class Author extends abstract_crud_1.AbstractCrudModel {
    constructor(db) {
        super(db, authorTable, authorColumns.id);
    }
    toPartialRaw(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                author_id: data.id,
                author_year: data.year,
                author_name: data.name,
                authority_type: data.type != undefined ? toRawAuthorType(data.type) : undefined,
                auth_list: data.authorityList,
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
    books(authorId) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Not implemented yet');
        });
    }
}
exports.Author = Author;
//# sourceMappingURL=author.js.map