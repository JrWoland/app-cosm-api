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
var APP_CONFIG = require('../../../localSettings.js');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var AccountService = require('./AccountsService');
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
                        return [4 /*yield*/, AccountService.getAccount(req.accountData.email)];
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
    AccountsController.prototype.createAccount = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email_1, password, account, err_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, email_1 = _a.email, password = _a.password;
                        return [4 /*yield*/, AccountService.getAccount(email_1)];
                    case 1:
                        account = _b.sent();
                        if (account.length >= 1)
                            return [2 /*return*/, res
                                    .status(422)
                                    .json({ message: 'Email adress already exists.', success: false })];
                        bcrypt.hash(password, 10, function (err, hash) { return __awaiter(_this, void 0, void 0, function () {
                            var err_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!err) return [3 /*break*/, 1];
                                        return [2 /*return*/, res.status(500).json({
                                                message: 'Error occured while creating new user',
                                                error: err,
                                                success: false,
                                            })];
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, AccountService.createAccount(email_1, hash)];
                                    case 2:
                                        _a.sent();
                                        res
                                            .status(201)
                                            .json({ message: 'Account created.', email: email_1, success: true });
                                        return [3 /*break*/, 4];
                                    case 3:
                                        err_2 = _a.sent();
                                        res.status(500).json({
                                            message: 'Error occured while saving new account in database',
                                            error: err_2.message,
                                            success: false,
                                        });
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _b.sent();
                        res.status(500).json({
                            message: 'Create account service unavailable',
                            error: err_1.message,
                            success: false,
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AccountsController.prototype.login = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var account_1, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, AccountService.getAccount(req.body.email)];
                    case 1:
                        account_1 = _a.sent();
                        if (account_1.length < 1)
                            return [2 /*return*/, res.status(401).json({ message: 'Auth failed.' })];
                        bcrypt.compare(req.body.password, account_1[0].password, function (err, result) {
                            if (err) {
                                return res.status(401).json({
                                    message: 'Auth failed because of database error',
                                    error: err,
                                    success: false,
                                });
                            }
                            if (result) {
                                var ACCOUNT = {
                                    email: account_1[0].email,
                                    accountId: account_1[0]._id,
                                };
                                var token = jwt.sign(ACCOUNT, APP_CONFIG.JWT_KEY, {
                                    expiresIn: APP_CONFIG.JWT_EXPIRES_IN,
                                });
                                res
                                    .status(200)
                                    .json({ message: 'Auth succesfull', token: token, success: true });
                                return;
                            }
                            res.status(401).json({ message: 'Auth failed by now', success: false });
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        res.status(500).json({
                            message: 'Login service unavailable',
                            error: err_3.message,
                            success: false,
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AccountsController.prototype.resetPassword = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                //need to implement email service first
                res.status(200).json({ message: 'Not resetPassword implemented' });
                return [2 /*return*/];
            });
        });
    };
    AccountsController.prototype.logout = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.status(200).json({ message: 'Not logout implemented' });
                return [2 /*return*/];
            });
        });
    };
    AccountsController.prototype.deleteAccount = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var accountData;
            return __generator(this, function (_a) {
                try {
                    accountData = req.accountData;
                    console.log('', accountData);
                    res.status(200).json({ message: 'Not delete implemented' });
                }
                catch (error) { }
                res.status(200).json({ message: 'Not deleteAccount implemented' });
                return [2 /*return*/];
            });
        });
    };
    AccountsController.prototype.updateEmail = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.status(200).json({ message: 'Not updateEmail implemented' });
                return [2 /*return*/];
            });
        });
    };
    AccountsController.prototype.updatePassword = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.status(200).json({ message: 'Not updatePassword implemented' });
                return [2 /*return*/];
            });
        });
    };
    return AccountsController;
}());
module.exports = new AccountsController();
