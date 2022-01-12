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
var APP_CONFIG = require('../../localSettings.js');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var UserService = require('../services/UserService');
var AccountService = require('../services/AccountService');
var UserController = /** @class */ (function () {
    function UserController() {
    }
    UserController.prototype.createUser = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var user, err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, UserService.getUser(req.body.email)];
                    case 1:
                        user = _a.sent();
                        if (user.length >= 1)
                            return [2 /*return*/, res.status(422).json({ message: 'Email adress already exists' })];
                        bcrypt.hash(req.body.password, 10, function (err, hash) { return __awaiter(_this, void 0, void 0, function () {
                            var user_1, account, err_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!err) return [3 /*break*/, 1];
                                        return [2 /*return*/, res.status(500).json({ message: 'Error occured while creating new user', error: err })];
                                    case 1:
                                        _a.trys.push([1, 4, , 5]);
                                        return [4 /*yield*/, UserService.createUser(req.body.email, hash)];
                                    case 2:
                                        user_1 = _a.sent();
                                        return [4 /*yield*/, AccountService.createAccount(user_1)];
                                    case 3:
                                        account = _a.sent();
                                        res.status(201).json({ message: 'User created', result: account });
                                        return [3 /*break*/, 5];
                                    case 4:
                                        err_2 = _a.sent();
                                        res.status(500).json({ message: 'Error occured while saving new user in database', error: err_2 });
                                        return [3 /*break*/, 5];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        res.status(500).json({ message: 'Create user service unavailable', error: err_1.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.loginUser = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var user_2, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, UserService.getUser(req.body.email)];
                    case 1:
                        user_2 = _a.sent();
                        if (user_2.length < 1)
                            return [2 /*return*/, res.status(401).json({ message: 'Auth failed' })];
                        bcrypt.compare(req.body.password, user_2[0].password, function (err, result) {
                            if (err) {
                                return res.status(401).json({ message: 'Auth failed because of database error', error: err });
                            }
                            if (result) {
                                var USER = { email: user_2[0].email, userId: user_2[0]._id };
                                var token = jwt.sign(USER, APP_CONFIG.JWT_KEY, { expiresIn: APP_CONFIG.JWT_EXPIRES_IN });
                                return res.status(200).json({ message: 'Auth succesfull', token: token });
                            }
                            res.status(401).json({ message: 'Auth failed by now' });
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        res.status(500).json({ message: 'Login service unavailable', error: err_3.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.deleteUser = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.userId;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, UserService.removeUser(id)];
                    case 2:
                        result = _a.sent();
                        console.log(result);
                        res.status(200).json({ message: 'User deleted' });
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        res.status(500).json({ message: 'Error occured while removing user from database', error: error_1 });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //TODO
    UserController.prototype.updateUser = function (req, res, next) { };
    //TODO And better place jwt in cookie
    UserController.prototype.logOutUser = function (req, res, next) { };
    return UserController;
}());
module.exports = new UserController();
