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
var AccountService = require('../services/AccountService');
var ClientService = require('../services/ClientService');
var AccountsController = /** @class */ (function () {
    function AccountsController() {
    }
    AccountsController.prototype.getAccount = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var account, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, AccountService.getAccount(req.userData.userId)];
                    case 1:
                        account = _a.sent();
                        res.status(200).json(account);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        res.status(500).json({ success: false, message: error_1.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AccountsController.prototype.getClientsList = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var account, clientList, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, AccountService.getAccount(req.userData.userId, 'clients', '_id name surname phone age')];
                    case 1:
                        account = _a.sent();
                        clientList = ClientService.getClientsList(account);
                        res.status(200).json(clientList);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        res.status(500).json({ success: false, message: error_2.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AccountsController.prototype.getClient = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var account, client, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, AccountService.getAccount(req.userData.userId, 'clients')];
                    case 1:
                        account = _a.sent();
                        return [4 /*yield*/, ClientService.getClient(account, req.params.clientId)];
                    case 2:
                        client = _a.sent();
                        res.status(200).json(client);
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        res.status(500).json({ success: false, message: error_3.message });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AccountsController.prototype.addClient = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var account, client, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, AccountService.getAccount(req.userData.userId, 'clients')];
                    case 1:
                        account = _a.sent();
                        return [4 /*yield*/, ClientService.addClient(account, req.body)];
                    case 2:
                        client = _a.sent();
                        res.status(200).json({ message: 'Succesfully added client', result: client });
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        res.status(500).json({ success: false, message: error_4.message });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AccountsController.prototype.updateClient = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var account, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, AccountService.getAccount(req.userData.userId, 'clients')];
                    case 1:
                        account = _a.sent();
                        return [4 /*yield*/, ClientService.updateClient(account, req.params.clientId, req.body)];
                    case 2:
                        _a.sent();
                        res.status(200).json({ message: 'Succesfully updated client', success: true });
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _a.sent();
                        res.status(500).json({ success: false, message: error_5.message });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AccountsController.prototype.removeClient = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var account, result, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, AccountService.getAccount(req.userData.userId, 'clients')];
                    case 1:
                        account = _a.sent();
                        return [4 /*yield*/, ClientService.removeClient(account, req.params.clientId)];
                    case 2:
                        result = _a.sent();
                        res.status(200).json({ message: 'Succesfully removed client', result: result });
                        return [3 /*break*/, 4];
                    case 3:
                        error_6 = _a.sent();
                        res.status(500).json({ success: false, message: error_6.message });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return AccountsController;
}());
module.exports = new AccountsController();
