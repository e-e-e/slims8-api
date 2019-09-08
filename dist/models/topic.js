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
const topicTable = 'mst_topic';
const topicColumns = {
    id: 'topic_id',
    name: 'topic',
    type: 'topic_type',
    authorityList: 'auth_list',
    classification: 'classification',
    created: 'input_date',
    updated: 'last_update',
};
var TopicType;
(function (TopicType) {
    TopicType[TopicType["TOPIC"] = 0] = "TOPIC";
    TopicType[TopicType["GEOGRAPHIC"] = 1] = "GEOGRAPHIC";
    TopicType[TopicType["NAME"] = 2] = "NAME";
    TopicType[TopicType["TEMPORAL"] = 3] = "TEMPORAL";
    TopicType[TopicType["GENRE"] = 4] = "GENRE";
    TopicType[TopicType["OCCUPATION"] = 5] = "OCCUPATION";
})(TopicType = exports.TopicType || (exports.TopicType = {}));
function toRawTopicType(data) {
    switch (data) {
        case undefined:
        case TopicType.TOPIC: return 't';
        case TopicType.GENRE: return 'gr';
        case TopicType.GEOGRAPHIC: return 'g';
        case TopicType.NAME: return 'n';
        case TopicType.OCCUPATION: return 'oc';
        case TopicType.TEMPORAL: return 'tm';
        default:
            throw new data_types_1.UnreachableError(data);
    }
}
function toTopicType(data) {
    switch (data) {
        case 'gr': return TopicType.GENRE;
        case 'g': return TopicType.GEOGRAPHIC;
        case 'n': return TopicType.NAME;
        case 'oc': return TopicType.OCCUPATION;
        case 'tm': return TopicType.TEMPORAL;
        case 't': return TopicType.TOPIC;
        default:
            throw new data_types_1.UnreachableError(data);
    }
}
function toRaw(data) {
    return {
        topic_id: data.id,
        topic: data.name,
        topic_type: toRawTopicType(data.type),
        auth_list: data.authorityList,
        classification: data.classification || '',
        input_date: data.created || new Date(),
        last_update: data.updated || new Date(),
    };
}
function toData(data) {
    return {
        id: data.topic_id,
        name: data.topic,
        type: toTopicType(data.topic_type),
        authorityList: data.auth_list,
        classification: data.classification,
        created: data.input_date,
        updated: data.last_update,
    };
}
class Topic extends abstract_crud_1.AbstractCrudModel {
    constructor(db) {
        super(db, topicTable, topicColumns.id);
    }
    toPartialRaw(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                topic_id: data.id,
                topic: data.name,
                topic_type: data.type != undefined ? toRawTopicType(data.type) : undefined,
                auth_list: data.authorityList,
                classification: data.classification,
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
exports.Topic = Topic;
//# sourceMappingURL=topic.js.map