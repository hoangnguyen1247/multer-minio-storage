"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseFileKey = parseFileKey;

var _path = _interopRequireDefault(require("path"));

function parseFileKey(f, pad) {
  var delimeter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "-";
  return _path["default"].dirname(f) + "/" + _path["default"].basename(f, _path["default"].extname(f)) + delimeter + pad + _path["default"].extname(f.toLowerCase());
}