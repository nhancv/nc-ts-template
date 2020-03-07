"use strict";
/*
 * MIT License
 *
 * Copyright (c) 2018 Nhan Cao
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var RilModule_1 = __importDefault(require("../Base/RilModule"));
var TemplateBot_1 = __importDefault(require("./Provider/TelegramBot/TemplateBot"));
var MongoMigrate_1 = require("./Provider/MongoDB/MongoMigrate");
var MongoProvider_1 = require("./Provider/MongoDB/MongoProvider");
var EmailNotifier_1 = __importDefault(require("./Provider/EmailNotifier"));
var CronJob_1 = __importDefault(require("./Provider/CronJob"));
var BullMQJob_1 = __importDefault(require("./Provider/BullMQJob"));
var Business = /** @class */ (function (_super) {
    __extends(Business, _super);
    function Business() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Business.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var bot, emailNotifier, bullMQJob, cronJob;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // @nhancv 9/16/19: Connect db
                    return [4 /*yield*/, MongoProvider_1.MongoProvider.instance.connect()];
                    case 1:
                        // @nhancv 9/16/19: Connect db
                        _a.sent();
                        // @nhancv 9/16/19: Check migrate
                        return [4 /*yield*/, new MongoMigrate_1.MongoMigrate().migrate()];
                    case 2:
                        // @nhancv 9/16/19: Check migrate
                        _a.sent();
                        bot = new TemplateBot_1.default();
                        return [4 /*yield*/, bot.create()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, bot.start()];
                    case 4:
                        _a.sent();
                        emailNotifier = new EmailNotifier_1.default();
                        emailNotifier.setBot(bot);
                        return [4 /*yield*/, emailNotifier.start()];
                    case 5:
                        _a.sent();
                        bullMQJob = BullMQJob_1.default.instance;
                        return [4 /*yield*/, bullMQJob.execute()];
                    case 6:
                        _a.sent();
                        cronJob = new CronJob_1.default();
                        cronJob.setBot(bot);
                        return [4 /*yield*/, cronJob.execute()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Business.prototype.gatewayOutput = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    Business.prototype.gatewayRequest = function (requestData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    return Business;
}(RilModule_1.default));
exports.default = Business;
//# sourceMappingURL=index.js.map