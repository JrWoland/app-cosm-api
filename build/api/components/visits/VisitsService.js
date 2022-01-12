"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var mongsoose = require('mongoose');
var Client = require('../clients/ClientsModel');
var Visit = require('./VisitsModel');
var VisitService = /** @class */ (function () {
    function VisitService() {
    }
    VisitService.prototype.getVisitList = function (clientId) {
        return __awaiter(this, void 0, void 0, function () {
            var client, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Client.findById(clientId)
                                .select('visits._id visits.date visits.time visits.done')
                                .exec()];
                    case 1:
                        client = _a.sent();
                        return [2 /*return*/, client.visits];
                    case 2:
                        error_1 = _a.sent();
                        throw new Error(error_1);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    VisitService.prototype.getVisit = function (client, visitId) {
        return __awaiter(this, void 0, void 0, function () {
            var visit;
            return __generator(this, function (_a) {
                try {
                    visit = client.visits.find(function (item) { return item._id.toString() === visitId; });
                    if (!visit)
                        throw new Error('Visit does not exist.');
                    return [2 /*return*/, visit];
                }
                catch (error) {
                    throw new Error(error);
                }
                return [2 /*return*/];
            });
        });
    };
    VisitService.prototype.addVisit = function (client, body) {
        return __awaiter(this, void 0, void 0, function () {
            var visit, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        visit = new Visit(__assign(__assign({}, body), { _id: mongsoose.Types.ObjectId() }));
                        client.visits.unshift(visit);
                        return [4 /*yield*/, client.save()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        throw new Error(error_2);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    VisitService.prototype.updateVisit = function (_a) {
        var params = _a.params, body = _a.body;
        return __awaiter(this, void 0, void 0, function () {
            var visit, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        visit = Visit(__assign(__assign({}, body), { _id: mongsoose.Types.ObjectId(params.visitId) }));
                        return [4 /*yield*/, Client
                                .findByIdAndUpdate({
                                _id: mongsoose.Types.ObjectId(params.clientId),
                            }, {
                                $set: { 'visits.$[el]': visit }
                            }, {
                                arrayFilters: [{ "el._id": mongsoose.Types.ObjectId(params.visitId) }],
                                new: true,
                                useFindAndModify: false
                            }).exec()];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _b.sent();
                        throw new Error(error_3);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    VisitService.prototype.removeVisit = function (_a) {
        var params = _a.params;
        return __awaiter(this, void 0, void 0, function () {
            var client, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Client
                                .findByIdAndUpdate({ _id: mongsoose.Types.ObjectId(params.clientId) }, {
                                $pull: { visits: { _id: mongsoose.Types.ObjectId(params.visitId) } }
                            }).exec()];
                    case 1:
                        client = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _b.sent();
                        throw new Error(error_4);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return VisitService;
}());
module.exports = new VisitService();
