"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressServer = void 0;
require('dotenv').config();
var express_1 = __importDefault(require("express"));
var app = (0, express_1.default)();
var morgan_1 = __importDefault(require("morgan"));
var serverHeaders_1 = __importDefault(require("./infra/settings/serverHeaders"));
var morganSettings_1 = __importDefault(require("./infra/settings/morganSettings"));
var UsersApi_1 = __importDefault(require("./api/components/users/UsersApi"));
var AccountsApi_1 = __importDefault(require("./api/components/accounts/AccountsApi"));
var ClientsApi_1 = __importDefault(require("./api/components/clients/ClientsApi"));
var VisitsApi_1 = __importDefault(require("./api/components/visits/VisitsApi"));
var ExpressServer = /** @class */ (function () {
    function ExpressServer() {
    }
    ExpressServer.prototype.create = function (serverVersion) {
        app.use(express_1.default.urlencoded({ extended: false }));
        app.use(express_1.default.json());
        app.use(serverHeaders_1.default);
        app.use((0, morgan_1.default)(morganSettings_1.default));
        app.get('/', function (req, res) {
            return res.status(200).json({ version: serverVersion });
        });
        app.use('/uploads/images', express_1.default.static('uploads/images'));
        app.use('/user', UsersApi_1.default);
        app.use('/account', AccountsApi_1.default);
        app.use('/clients', ClientsApi_1.default);
        app.use('/visits', VisitsApi_1.default);
        app.use(function (req, res, next) {
            var error = new Error('Not found');
            error.status = 404;
            next(error);
        });
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.json({
                message: 'Could not found a proper route',
            });
        });
        return app;
    };
    return ExpressServer;
}());
exports.ExpressServer = ExpressServer;
