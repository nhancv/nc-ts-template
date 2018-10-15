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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var body_parser_1 = __importDefault(require("body-parser"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var compression_1 = __importDefault(require("compression"));
var ENV = __importStar(require("./env"));
var config = ENV.get();
var app = express_1.default();
var log = console.log;
var port = process.env.PORT || 7090;
// Body parser: https://github.com/expressjs/body-parser
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
// CORS on ExpressJS: https://github.com/expressjs/cors
app.use(cors_1.default());
// Cookie parser: https://github.com/expressjs/cookie-parser
app.use(cookie_parser_1.default());
// Use gzip compression
app.use(compression_1.default());
/**
 * API calls, use Postman for testing
 * This block should declare before default route
 */
app.get('/api/about', function (req, res) {
    res.json({ 'about': 'https://nhancv.github.io' });
});
/**
 * Default routing
 */
app.get('*', function (req, res) {
    res.redirect('/api/about');
});
/**
 * Start listen
 */
app.listen(port, function () {
    log('Server listening at port %d', port);
});
log(config);
//# sourceMappingURL=index.js.map