"use strict";
//visit https://www.npmjs.com/package/morgan to see more details
var MORGAN_SETTING_STRING = ':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms';
module.exports = MORGAN_SETTING_STRING;
