"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  RiveRenderer: true,
  useRive: true,
  useRiveString: true,
  useRiveNumber: true,
  useRiveBoolean: true,
  useRiveColor: true,
  useRiveEnum: true,
  useRiveTrigger: true
};
Object.defineProperty(exports, "RiveRenderer", {
  enumerable: true,
  get: function () {
    return _Rive.RiveRenderer;
  }
});
exports.default = void 0;
Object.defineProperty(exports, "useRive", {
  enumerable: true,
  get: function () {
    return _Rive.useRive;
  }
});
Object.defineProperty(exports, "useRiveBoolean", {
  enumerable: true,
  get: function () {
    return _Rive.useRiveBoolean;
  }
});
Object.defineProperty(exports, "useRiveColor", {
  enumerable: true,
  get: function () {
    return _Rive.useRiveColor;
  }
});
Object.defineProperty(exports, "useRiveEnum", {
  enumerable: true,
  get: function () {
    return _Rive.useRiveEnum;
  }
});
Object.defineProperty(exports, "useRiveNumber", {
  enumerable: true,
  get: function () {
    return _Rive.useRiveNumber;
  }
});
Object.defineProperty(exports, "useRiveString", {
  enumerable: true,
  get: function () {
    return _Rive.useRiveString;
  }
});
Object.defineProperty(exports, "useRiveTrigger", {
  enumerable: true,
  get: function () {
    return _Rive.useRiveTrigger;
  }
});
var _types = require("./types");
Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});
var _Rive = _interopRequireWildcard(require("./Rive"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var _default = exports.default = _Rive.default;
//# sourceMappingURL=index.js.map