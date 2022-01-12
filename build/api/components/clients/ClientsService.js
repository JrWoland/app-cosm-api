"use strict";
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
var Client = require('./ClientsModel');
var AccountsService = require('../accounts/AccountsService');
var ClientService = /** @class */ (function () {
    function ClientService() {
    }
    ClientService.prototype.getClientsList = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var account, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, AccountsService.getAccount(userId, 'clients', '_id name surname phone age')];
                    case 1:
                        account = _a.sent();
                        return [2 /*return*/, account.clients];
                    case 2:
                        error_1 = _a.sent();
                        throw new Error(error_1);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ClientService.prototype.getClient = function (userId, clientId) {
        return __awaiter(this, void 0, void 0, function () {
            var account, client, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, AccountsService.getAccount(userId, 'clients', '_id name surname phone age')];
                    case 1:
                        account = _a.sent();
                        client = account.clients.find(function (item) { return item._id.toString() === clientId; });
                        if (!client)
                            throw new Error('Client does not exist.');
                        return [2 /*return*/, client];
                    case 2:
                        error_2 = _a.sent();
                        throw new Error(error_2);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ClientService.prototype.addClient = function (userId, body) {
        return __awaiter(this, void 0, void 0, function () {
            var account, client, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, AccountsService.getAccount(userId, 'clients')];
                    case 1:
                        account = _a.sent();
                        client = new Client({
                            _id: mongsoose.Types.ObjectId(),
                            name: body.name,
                            surname: body.surname,
                            phone: body.phone,
                            age: body.age,
                        });
                        return [4 /*yield*/, client.save()];
                    case 2:
                        _a.sent();
                        account.clients.push(client);
                        return [4 /*yield*/, account.save()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_3 = _a.sent();
                        throw new Error(error_3);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ClientService.prototype.updateClient = function (account, clientId, body) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedClient, client, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updatedClient = {
                            name: body.name,
                            surname: body.surname,
                            phone: body.phone,
                            age: body.age
                        };
                        client = this.getClient(account, clientId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Client
                                .updateOne(//using updateOne we can update only specific values
                            {
                                _id: client._id
                            }, {
                                $set: Object.assign(client, updatedClient)
                            }, {
                                runValidators: true
                            }).exec()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        throw new Error(error_4);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ClientService.prototype.removeClient = function (userId, clientId) {
        return __awaiter(this, void 0, void 0, function () {
            var account, client, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, AccountsService.getAccount(userId, 'clients', '_id')];
                    case 1:
                        account = _a.sent();
                        client = account.clients.find(function (item) { return item._id.toString() === clientId; });
                        if (!client)
                            throw new Error('Client does not exist.');
                        //remove from account array
                        account.clients.pull(client._id);
                        return [4 /*yield*/, account.save()
                            // remove from collection
                        ];
                    case 2:
                        _a.sent();
                        // remove from collection
                        return [4 /*yield*/, Client.findByIdAndRemove(client._id).exec()];
                    case 3:
                        // remove from collection
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_5 = _a.sent();
                        throw new Error(error_5.message);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return ClientService;
}());
module.exports = new ClientService();
