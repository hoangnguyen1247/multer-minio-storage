"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseFileKey = parseFileKey;

var _path = _interopRequireDefault(require("path"));

function parseFileKey(fileKey, pad) {
  return _path["default"].basename(fileKey, _path["default"].extname(fileKey)) + pad + '.' + _path["default"].extname(fileKey);
}