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
// export type PartialBiblio = BiblioData;
const biblioTable = `biblio`;
const biblioColumns = {
    id: 'biblio_id',
    gmd: 'gmd_id',
    title: 'title',
    statementOfResponsibility: 'sor',
    edition: 'edition',
    isbnIssn: 'isbn_issn',
    publisher: 'publisher_id',
    publishYear: 'publish_year',
    collation: 'collation',
    seriesTitle: 'series_title',
    callNumber: 'call_number',
    language: 'language_id',
    source: 'source',
    publishPlace: 'publish_place_id',
    classification: 'classification',
    notes: 'notes',
    image: 'image',
    // fileAttachment: 'file_att', // varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
    hide: 'opac_hide',
    promoted: 'promoted',
    labels: 'labels',
    frequency: 'frequency_id',
    specDetailInfo: 'spec_detail_info',
    contentType: 'content_type_id',
    mediaType: 'media_type_id',
    carrierType: 'carrier_type_id',
    created: 'input_date',
    // uid: 'uid', // int(11) DEFAULT NULL,  created: `input_date`, //  date NOT NULL,
    updated: `last_update` // date DEFAULT NULL,
};
function createOrUpdate(data, model) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!data)
            return;
        if (data.id === undefined) {
            try {
                return yield model.create(data);
            }
            catch (e) {
                const matches = yield model.find(data);
                // do we need to update?
                return matches.length ? matches[0].id : undefined;
            }
        }
        yield model.update(Object.assign({}, data, { id: data.id }));
        return data.id;
    });
}
function maybeCreateLanguage(data, model) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!data)
            return;
        try {
            yield model.create(data);
        }
        catch (e) {
            const matches = yield model.find(data);
            // do we need to update?
            return matches.length ? matches[0].id : undefined;
        }
        return data.id;
    });
}
function maybeGetData(id, model) {
    return __awaiter(this, void 0, void 0, function* () {
        if (id == undefined)
            return undefined;
        return model.get(id);
    });
}
class Biblio extends abstract_crud_1.AbstractCrudModel {
    constructor(db, models) {
        super(db, biblioTable, biblioColumns.id);
        this.models = models;
    }
    toPartialRaw(data) {
        return {
            biblio_id: data.id,
            language_id: data.language && data.language.id,
            gmd_id: data.gmd && data.gmd.id,
            publisher_id: data.publisher && data.publisher.id,
            publish_place_id: data.publishPlace && data.publishPlace.id,
            frequency_id: data.frequency && data.frequency.id,
            content_type_id: data.contentType && data.contentType.id,
            media_type_id: data.mediaType && data.mediaType.id,
            carrier_type_id: data.carrierType && data.carrierType.id,
            title: data.title,
            sor: data.statementOfResponsibility,
            edition: data.edition,
            isbn_issn: data.isbnIssn,
            publish_year: data.publishYear,
            collation: data.collation,
            series_title: data.seriesTitle,
            call_number: data.callNumber,
            classification: data.classification,
            notes: data.notes,
            image: data.image,
            // file_att: null,
            opac_hide: data.hide == undefined ? undefined : data.hide ? 1 : 0,
            promoted: data.hide == undefined ? undefined : data.hide ? 1 : 0,
            labels: data.labels,
            spec_detail_info: data.specDetailInfo,
        };
    }
    toRaw(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                biblio_id: data.id,
                language_id: data.language ? yield maybeCreateLanguage(data.language, this.models.language) : 'en',
                gmd_id: yield createOrUpdate(data.gmd, this.models.gmd),
                publisher_id: yield createOrUpdate(data.publisher, this.models.publisher),
                publish_place_id: yield createOrUpdate(data.publishPlace, this.models.publisher),
                frequency_id: (yield createOrUpdate(data.frequency, this.models.frequency)) || 0,
                content_type_id: yield createOrUpdate(data.contentType, this.models.contentType),
                media_type_id: yield createOrUpdate(data.mediaType, this.models.mediaType),
                carrier_type_id: yield createOrUpdate(data.carrierType, this.models.carrierType),
                title: data.title,
                sor: data.statementOfResponsibility,
                edition: data.edition,
                isbn_issn: data.isbnIssn,
                publish_year: data.publishYear,
                collation: data.collation,
                series_title: data.seriesTitle,
                call_number: data.callNumber,
                source: null,
                classification: data.classification,
                notes: data.notes || '',
                image: data.image,
                // file_att: null,
                opac_hide: data.hide ? 1 : 0,
                promoted: data.promoted ? 1 : 0,
                labels: data.labels,
                spec_detail_info: data.specDetailInfo,
                input_date: data.created || new Date(),
                last_update: data.updated || new Date(),
            };
        });
    }
    toData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                id: data.biblio_id,
                language: data.language_id ? yield this.models.language.get(data.language_id) : undefined,
                gmd: yield maybeGetData(data.gmd_id, this.models.gmd),
                publisher: yield maybeGetData(data.publisher_id, this.models.publisher),
                publishPlace: yield maybeGetData(data.publish_place_id, this.models.place),
                frequency: yield maybeGetData(data.frequency_id, this.models.frequency),
                contentType: yield maybeGetData(data.content_type_id, this.models.contentType),
                mediaType: yield maybeGetData(data.media_type_id, this.models.mediaType),
                carrierType: yield maybeGetData(data.carrier_type_id, this.models.carrierType),
                title: data.title,
                isbnIssn: data.isbn_issn,
                statementOfResponsibility: data.sor,
                edition: data.edition,
                collation: data.collation,
                seriesTitle: data.series_title,
                callNumber: data.call_number,
                classification: data.classification,
                publishYear: data.publish_year,
                notes: data.notes,
                image: data.image,
                // file_att: string, // varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
                labels: data.labels,
                specDetailInfo: data.spec_detail_info,
                hide: !!data.opac_hide,
                promoted: !!data.promoted,
                created: data.input_date,
                updated: data.last_update,
            };
        });
    }
}
exports.Biblio = Biblio;
//# sourceMappingURL=biblio.js.map