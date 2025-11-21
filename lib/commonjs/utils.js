"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPropertyTypeString = void 0;
exports.intToRiveRGBA = intToRiveRGBA;
exports.parseColor = parseColor;
exports.parsePossibleSources = parsePossibleSources;
var _reactNative = require("react-native");
/* eslint-disable no-bitwise */

function parsePossibleSources(source) {
  if (typeof source === 'number') {
    const resolvedAsset = _reactNative.Image.resolveAssetSource(source);
    if (resolvedAsset && resolvedAsset.uri) {
      return {
        sourceAssetId: resolvedAsset.uri
      };
    } else {
      throw new Error('Invalid asset source provided.');
    }
  }
  const uri = source.uri;
  if (typeof source === 'object' && uri) {
    return {
      sourceUrl: uri
    };
  }
  const asset = source.fileName;
  const path = source.path;
  if (typeof source === 'object' && asset) {
    const result = {
      sourceAsset: asset
    };
    if (path) {
      result.path = path;
    }
    return result;
  }
  throw new Error('Invalid source provided.');
}
function parseColor(color) {
  const hex = color.replace(/^#/, '');
  const isValidHex = /^[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(hex);
  if (!isValidHex) {
    console.warn(`Rive invalid hex color: ${color}`);
    return {
      r: 0,
      g: 0,
      b: 0,
      a: 255
    };
  }
  let r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16),
    a = 255;

  // Optionally parse alpha channel if present
  if (hex.length === 8) {
    a = parseInt(hex.slice(6, 8), 16);
  }
  return {
    r,
    g,
    b,
    a
  };
}
function intToRiveRGBA(colorValue) {
  const a = colorValue >> 24 & 0xff;
  const r = colorValue >> 16 & 0xff;
  const g = colorValue >> 8 & 0xff;
  const b = colorValue & 0xff;
  return {
    r,
    g,
    b,
    a
  };
}
const getPropertyTypeString = propertyType => propertyType;
exports.getPropertyTypeString = getPropertyTypeString;
//# sourceMappingURL=utils.js.map