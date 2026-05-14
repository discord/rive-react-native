"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertErrorFromNativeToRN = convertErrorFromNativeToRN;
exports.isEnum = isEnum;
var _types = require("./types");
function isEnum(enumType, enumValue) {
  return Object.values(enumType).includes(enumValue);
}
function convertErrorFromNativeToRN(errorFromNative) {
  if (isEnum(_types.RNRiveErrorType, errorFromNative.type)) {
    return {
      type: errorFromNative.type,
      message: errorFromNative.message
    };
  }
  return null;
}
//# sourceMappingURL=helpers.js.map