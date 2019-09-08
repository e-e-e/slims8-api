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
const frequencyTable = 'mst_frequency';
const frequencyColumns = {
    id: 'frequency_id',
    frequency: 'frequency',
    languagePrefix: 'language_prefix',
    timeIncrement: 'time_increment',
    timeUnit: 'time_unit',
    created: 'input_date',
    updated: 'last_update',
};
function toRaw(data) {
    return {
        frequency_id: data.id,
        frequency: data.frequency,
        language_prefix: data.languagePrefix,
        time_increment: data.timeIncrement,
        time_unit: data.timeUnit,
        input_date: data.created || new Date(),
        last_update: data.updated || new Date(),
    };
}
function toData(data) {
    return {
        id: data.frequency_id,
        frequency: data.frequency,
        languagePrefix: data.language_prefix,
        timeIncrement: data.time_increment,
        timeUnit: data.time_unit,
        created: data.input_date,
        updated: data.last_update,
    };
}
class Frequency extends abstract_crud_1.AbstractCrudModel {
    constructor(db) {
        super(db, frequencyTable, frequencyColumns.id);
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
exports.Frequency = Frequency;
//# sourceMappingURL=frequency.js.map