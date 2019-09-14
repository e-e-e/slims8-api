"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const biblio_1 = require("./models/biblio");
const author_1 = require("./models/author");
const topic_1 = require("./models/topic");
const publisher_1 = require("./models/publisher");
const gmd_1 = require("./models/gmd");
const place_1 = require("./models/place");
const content_type_1 = require("./models/content_type");
const carrier_type_1 = require("./models/carrier_type");
const media_type_1 = require("./models/media_type");
const frequency_1 = require("./models/frequency");
const language_1 = require("./models/language");
function createSlimsApi(connection) {
    const db = knex_1.default(connection);
    const publisher = new publisher_1.Publisher(db);
    const gmd = new gmd_1.GeneralMaterialDesignation(db);
    const place = new place_1.Place(db);
    const contentType = new content_type_1.ContentType(db);
    const carrierType = new carrier_type_1.CarrierType(db);
    const mediaType = new media_type_1.MediaType(db);
    const frequency = new frequency_1.Frequency(db);
    const language = new language_1.Language(db);
    const author = new author_1.Author(db);
    const topic = new topic_1.Topic(db);
    const biblio = new biblio_1.Biblio(db, {
        publisher,
        gmd,
        place,
        contentType,
        carrierType,
        mediaType,
        frequency,
        language,
        author,
        topic,
    });
    return {
        biblio,
        author,
        publisher,
        gmd,
        place,
        contentType,
        carrierType,
        mediaType,
        frequency,
        language,
        topic,
    };
}
exports.createSlimsApi = createSlimsApi;
//# sourceMappingURL=index.js.map