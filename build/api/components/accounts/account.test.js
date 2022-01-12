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
// jest.useRealTimers();
var ExpressServer = require('../../../server');
var mongoose = require('mongoose');
var request = require('supertest');
var AccountsModel = require('./AccountsModel');
var app = new ExpressServer().create();
beforeEach(function (done) {
    mongoose.connect("mongodb://localhost:27017/cosm-local", { useNewUrlParser: true, useUnifiedTopology: true, }, function () { return done(); });
});
afterEach(function (done) {
    mongoose.connection.close(function () { return done(); });
});
var notExistUser = { email: "fake@fake.com", password: "fake" };
var testUser = { email: "test@test.com", password: "test" };
var registerUser = { email: "register@register.com", password: "register" };
var deleteUser = { email: "delete@delete.com", password: "delete" };
it('Return not auth error from /account', function () { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, request(app).get('/account')];
            case 1:
                res = _a.sent();
                expect(res.status).toEqual(401);
                expect(res.body.message).toEqual('Auth failed. Login first.');
                expect(res.body.success).toBeFalsy();
                return [2 /*return*/];
        }
    });
}); });
it('Not exists user /account/login', function () { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, request(app).post('/account/login').send(notExistUser)];
            case 1:
                res = _a.sent();
                expect(res.status).toEqual(401);
                expect(res.body.message).toEqual('Auth failed.');
                expect(res.body.success).toBeFalsy();
                return [2 /*return*/];
        }
    });
}); });
it('Success logged user /account/login', function () { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, request(app).post('/account/login').send(testUser)];
            case 1:
                res = _a.sent();
                expect(res.status).toEqual(200);
                expect(res.body.message).toEqual('Auth succesfull');
                expect(res.body.success).toBeTruthy();
                expect(res.body.token).toBeTruthy();
                return [2 /*return*/];
        }
    });
}); });
it('Success logged user /account/register', function () { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, request(app).post('/account/register').send(testUser)];
            case 1:
                res = _a.sent();
                expect(res.status).toEqual(422);
                expect(res.body.message).toEqual('Email adress already exists.');
                expect(res.body.success).toBeFalsy();
                return [2 /*return*/];
        }
    });
}); });
it('Success Register new Account /account/register', function () { return __awaiter(void 0, void 0, void 0, function () {
    var res, newAccount;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, request(app).post('/account/register').send(registerUser)];
            case 1:
                res = _a.sent();
                expect(res.status).toEqual(201);
                expect(res.body.message).toEqual('Account created.');
                expect(res.body.success).toBeTruthy();
                expect(res.body.email).toEqual(registerUser.email);
                return [4 /*yield*/, AccountsModel.findOne({ email: registerUser.email })];
            case 2:
                newAccount = _a.sent();
                expect(newAccount.services[0].name).toEqual('LASHES');
                expect(newAccount.services[0].expires).toEqual(new Date(2100, 1, 1));
                // and delete account
                return [4 /*yield*/, AccountsModel.deleteOne({ email: registerUser.email })];
            case 3:
                // and delete account
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
it('Success  new Account /account/register', function () { return __awaiter(void 0, void 0, void 0, function () {
    var res, newAccount;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, request(app).post('/account/register').send(registerUser)];
            case 1:
                res = _a.sent();
                expect(res.status).toEqual(201);
                expect(res.body.message).toEqual('Account created.');
                expect(res.body.success).toBeTruthy();
                expect(res.body.email).toEqual(registerUser.email);
                return [4 /*yield*/, AccountsModel.findOne({ email: registerUser.email })];
            case 2:
                newAccount = _a.sent();
                expect(newAccount.services[0].name).toEqual('LASHES');
                expect(newAccount.services[0].expires).toEqual(new Date(2100, 1, 1));
                // and delete account
                return [4 /*yield*/, AccountsModel.deleteOne({ email: registerUser.email })];
            case 3:
                // and delete account
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
it('Delete account /account/register', function () { return __awaiter(void 0, void 0, void 0, function () {
    var resRegister, resLogin, resDelete;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, request(app).post('/account/register').send(deleteUser)];
            case 1:
                resRegister = _a.sent();
                return [4 /*yield*/, request(app).post('/account/login').send(deleteUser)
                    //need to have bearer token
                ];
            case 2:
                resLogin = _a.sent();
                return [4 /*yield*/, request(app).delete('/account/')
                        .set('Authorization', "Bearer ".concat(resLogin.body.token))
                        .send()];
            case 3:
                resDelete = _a.sent();
                expect(res.status).toEqual(200);
                expect(res.body.message).toEqual('Account deleted.');
                expect(res.body.success).toBeTruthy();
                return [2 /*return*/];
        }
    });
}); });
