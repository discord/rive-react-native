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
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
var _default = exports.default = _Rive.default;
//# sourceMappingURL=index.js.map