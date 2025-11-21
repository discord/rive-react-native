"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.RiveViewManager = exports.RiveRenderer = exports.RiveNativeEventEmitter = void 0;
exports.useRive = useRive;
exports.useRiveBoolean = useRiveBoolean;
exports.useRiveColor = useRiveColor;
exports.useRiveEnum = useRiveEnum;
exports.useRiveNumber = useRiveNumber;
exports.useRiveString = useRiveString;
exports.useRiveTrigger = useRiveTrigger;
var _react = _interopRequireWildcard(require("react"));
var _resolveAssetSource2 = _interopRequireDefault(require("react-native/Libraries/Image/resolveAssetSource"));
var _reactNative = require("react-native");
var _types = require("./types");
var _helpers = require("./helpers");
var _utils = require("./utils");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// This import path isn't handled by @types/react-native
// @ts-ignore

class RiveNativeEventEmitter {
  constructor(emitter, riveRef) {
    this.emitter = emitter;
    this.riveRef = riveRef;
  }
  nativeSubscriptions = {};
  callbacks = {};
  addListener(path, propertyType, reactTag, callback) {
    // const reactTag = findNodeHandle(this.riveRef.current);
    if (!reactTag) {
      console.warn('[Rive] RiveRef viewTag is null. Cannot register property listener.');
      return;
    }
    // "Unique" key for the property listener
    // The key is a combination of the property type and the path
    const key = this.generatePropertyKey(path, propertyType, reactTag);

    // Registering the callback for this key if it doesn't exist
    // or if the callback is not already registered
    if (!this.callbacks[key]) {
      this.callbacks[key] = [callback];
    } else if (!this.callbacks[key].includes(callback)) {
      this.callbacks[key].push(callback);
    }

    // Registering a native listener for this key if the listener
    // is not already registered
    if (!this.nativeSubscriptions[key]) {
      let subscription = this.emitter.addListener(key, value => {
        var _this$callbacks$key;
        // Call all the callbacks registered for this key
        (_this$callbacks$key = this.callbacks[key]) === null || _this$callbacks$key === void 0 || _this$callbacks$key.forEach(storedCallback => {
          storedCallback(value);
        });
      });
      _reactNative.UIManager.dispatchViewManagerCommand(reactTag, 'registerPropertyListener',
      // Name of the native command
      [path, (0, _utils.getPropertyTypeString)(propertyType)]);
      this.nativeSubscriptions[key] = subscription;
    }
  }
  generatePropertyKey(path, propertyType, reactTag) {
    return `${(0, _utils.getPropertyTypeString)(propertyType)}:${path}:${reactTag}`;
  }
  removeListener(path, propertyType, reactTag, callback) {
    if (!reactTag) {
      console.warn('[Rive] RiveRef viewTag is null. Cannot unregister property listener.');
      return;
    }
    const key = this.generatePropertyKey(path, propertyType, reactTag);
    if (this.callbacks[key]) {
      // Remove the callback from the list of callbacks
      this.callbacks[key] = this.callbacks[key].filter(storedCallback => storedCallback !== callback);
      // If there are no more callbacks for this key, remove the native listener
      if (this.callbacks[key].length === 0) {
        var _this$nativeSubscript;
        (_this$nativeSubscript = this.nativeSubscriptions[key]) === null || _this$nativeSubscript === void 0 || _this$nativeSubscript.remove();
        delete this.nativeSubscriptions[key];
        delete this.callbacks[key];
      }
    }
  }
}
exports.RiveNativeEventEmitter = RiveNativeEventEmitter;
function useRive() {
  const [ref, setRef] = (0, _react.useState)(null);
  const setRiveRef = (0, _react.useCallback)(node => {
    if (!node || !node.internalNativeEmitter) {
      return;
    }
    let viewTag = node.viewTag();
    if (viewTag === null) {
      console.warn('[Rive] RiveRef viewTag is null.');
      return;
    }
    const nativeEmitter = node.internalNativeEmitter();
    if (!nativeEmitter) {
      console.warn('[Rive] Native event emitter is not initialized.');
      return;
    }

    // A listener that is called when the native view is loaded and Rive
    // is ready to be used.
    const subscription = nativeEmitter.emitter.addListener(`RiveReactNativeLoaded:${viewTag}`, () => {
      setRef(node);
      subscription.remove(); // Remove the listener after the event is reported
    });
  }, []);
  return [setRiveRef, ref];
}
function useRiveBoolean(riveRef, path) {
  return useRivePropertyListener(riveRef, path, _types.PropertyType.Boolean);
}
function useRiveString(riveRef, path) {
  return useRivePropertyListener(riveRef, path, _types.PropertyType.String);
}
function useRiveNumber(riveRef, path) {
  return useRivePropertyListener(riveRef, path, _types.PropertyType.Number);
}
function useRiveEnum(riveRef, path) {
  return useRivePropertyListener(riveRef, path, _types.PropertyType.Enum);
}
function useRiveColor(riveRef, path) {
  return useRivePropertyListener(riveRef, path, _types.PropertyType.Color);
}
function useRiveTrigger(riveRef, path, onTrigger) {
  const triggerCallback = (0, _react.useCallback)(() => {
    onTrigger === null || onTrigger === void 0 || onTrigger();
  }, [onTrigger]);
  (0, _react.useEffect)(() => {
    var _riveRef$internalNati;
    const listener = riveRef === null || riveRef === void 0 || (_riveRef$internalNati = riveRef.internalNativeEmitter) === null || _riveRef$internalNati === void 0 ? void 0 : _riveRef$internalNati.call(riveRef);
    if (!listener) return () => {};
    const reactTag = (0, _reactNative.findNodeHandle)(riveRef.viewTag());
    if (!reactTag) return () => {};
    listener.addListener(path, _types.PropertyType.Trigger, reactTag, triggerCallback);
    return () => {
      listener.removeListener(path, _types.PropertyType.Trigger, reactTag, triggerCallback);
    };
  }, [riveRef, path, triggerCallback]);

  // Function to fire the trigger
  const trigger = (0, _react.useCallback)(() => {
    if (!riveRef) {
      if (__DEV__) {
        console.warn(`[Rive] Tried to trigger "${path}" before riveRef was available.`);
      }
      return;
    }
    riveRef.trigger(path);
  }, [riveRef, path]);
  return riveRef ? trigger : undefined;
}
function useRivePropertyListener(riveRef, path, propertyType) {
  const [value, setValue] = (0, _react.useState)(undefined);

  // Listener callback to update state for non-color properties
  const listenerCallback = (0, _react.useCallback)(newValue => {
    setValue(newValue);
  }, []);

  // Listener callback to update state for color properties
  const listenerCallbackWithColor = (0, _react.useCallback)(newValue => {
    const rgbaValue = (0, _utils.intToRiveRGBA)(newValue);
    setValue(rgbaValue);
  }, []);
  (0, _react.useEffect)(() => {
    var _riveRef$internalNati2;
    const listener = riveRef === null || riveRef === void 0 || (_riveRef$internalNati2 = riveRef.internalNativeEmitter) === null || _riveRef$internalNati2 === void 0 ? void 0 : _riveRef$internalNati2.call(riveRef);
    if (!listener) return () => {};
    const reactTag = (0, _reactNative.findNodeHandle)(riveRef.viewTag());
    if (propertyType === _types.PropertyType.Color) {
      listener.addListener(path, propertyType, reactTag, listenerCallbackWithColor);
      return () => {
        listener.removeListener(path, propertyType, reactTag, listenerCallbackWithColor);
      };
    } else {
      listener.addListener(path, propertyType, reactTag, listenerCallback);
      return () => {
        listener.removeListener(path, propertyType, reactTag, listenerCallback);
      };
    }
  }, [riveRef, path, propertyType, listenerCallback, listenerCallbackWithColor]);

  // Setter function
  const setPropertyValue = (0, _react.useCallback)(newValue => {
    if (!riveRef) {
      if (__DEV__) {
        console.warn(`[Rive] Tried to set property "${path}" before riveRef was available.`);
      }
      return;
    }
    switch (propertyType) {
      case _types.PropertyType.Number:
        riveRef.setNumber(path, newValue);
        break;
      case _types.PropertyType.Boolean:
        riveRef.setBoolean(path, newValue);
        break;
      case _types.PropertyType.String:
        riveRef.setString(path, newValue);
        break;
      case _types.PropertyType.Enum:
        riveRef.setEnum(path, newValue);
        break;
      case _types.PropertyType.Color:
        const parsedColor = typeof newValue === 'string' ? (0, _utils.parseColor)(newValue) : newValue;
        riveRef.setColor(path, parsedColor);
        break;
      case _types.PropertyType.Image:
        riveRef.setImage(path, newValue);
        break;
      case _types.PropertyType.Artboard:
        riveRef.setArtboard(path, newValue);
        break;
      default:
        if (__DEV__) {
          console.warn(`[Rive] Unsupported property type in generic listener: ${propertyType}`);
        }
    }
  }, [riveRef, path, propertyType]);
  return [value, setPropertyValue];
}
const {
  RiveReactNativeRendererModule,
  RiveReactNativeModule,
  RiveReactNativeEventModule
} = _reactNative.NativeModules;
const nativeEventEmitter = _reactNative.Platform.OS === 'android' ? new _reactNative.NativeEventEmitter() // Not needed for Android
: new _reactNative.NativeEventEmitter(RiveReactNativeEventModule);
const RiveRenderer = exports.RiveRenderer = RiveReactNativeRendererModule;
const VIEW_NAME = 'RiveReactNativeView';
const RiveViewManager = exports.RiveViewManager = (0, _reactNative.requireNativeComponent)(VIEW_NAME);
const RiveContainer = /*#__PURE__*/_react.default.forwardRef(({
  children,
  onPlay,
  onPause,
  onStop,
  onLoopEnd,
  onStateChanged,
  onRiveEventReceived,
  onError,
  style,
  autoplay = true,
  resourceName: resourceNameProp,
  url: urlProp,
  alignment = _types.Alignment.Center,
  fit = _types.Fit.Contain,
  layoutScaleFactor,
  artboardName,
  referencedAssets: referencedAssets,
  dataBinding = (0, _types.AutoBind)(false),
  animationName,
  source,
  stateMachineName,
  testID
}, ref) => {
  const assetID = typeof source === 'number' ? source : null;
  const sourceURI = typeof source === 'object' ? source.uri : null;
  const {
    resourceName,
    url
  } = (0, _react.useMemo)(() => {
    var _resolveAssetSource;
    if (resourceNameProp) {
      return {
        resourceName: resourceNameProp
      };
    }
    if (urlProp) {
      return {
        url: urlProp
      };
    }
    const assetURI = assetID ? (_resolveAssetSource = (0, _resolveAssetSource2.default)(assetID)) === null || _resolveAssetSource === void 0 ? void 0 : _resolveAssetSource.uri : sourceURI;
    if (!assetURI) {
      return {};
    }

    // handle http address and dev server
    if (assetURI.match(/^https?:\/\//)) {
      return {
        url: assetURI
      };
    }

    // handle iOS bundled asset
    if (assetURI.match(/^file:\/\//)) {
      var _assetURI$match;
      // strip resource name for assets embedded in the app at build time
      const strippedName = (_assetURI$match = assetURI.match(/.*\.app\/(.*)\.riv/)) === null || _assetURI$match === void 0 ? void 0 : _assetURI$match[1];
      if (strippedName) {
        return {
          resourceName: strippedName
        };
      }

      // fallback to url for downloaded assets (e.g. EAS Updates)
      return {
        url: assetURI
      };
    }

    // handle Android bundled asset or resource name uri
    return {
      resourceName: assetURI
    };
  }, [assetID, sourceURI, resourceNameProp, urlProp]);
  if (!resourceName && !url) {
    throw new Error('Invalid Rive resource. Please provide a valid resource.');
  }
  const riveRef = (0, _react.useRef)(null);
  const isUserHandlingErrors = onError !== undefined;
  const onPlayHandler = (0, _react.useCallback)(event => {
    const {
      animationName: eventAnimationName,
      isStateMachine
    } = event.nativeEvent;
    onPlay === null || onPlay === void 0 || onPlay(eventAnimationName, isStateMachine);
  }, [onPlay]);
  const onPauseHandler = (0, _react.useCallback)(event => {
    const {
      animationName: eventAnimationName,
      isStateMachine
    } = event.nativeEvent;
    onPause === null || onPause === void 0 || onPause(eventAnimationName, isStateMachine);
  }, [onPause]);
  const onStopHandler = (0, _react.useCallback)(event => {
    const {
      animationName: eventAnimationName,
      isStateMachine
    } = event.nativeEvent;
    onStop === null || onStop === void 0 || onStop(eventAnimationName, isStateMachine);
  }, [onStop]);
  const onLoopEndHandler = (0, _react.useCallback)(event => {
    const {
      animationName: eventAnimationName,
      loopMode
    } = event.nativeEvent;
    onLoopEnd === null || onLoopEnd === void 0 || onLoopEnd(eventAnimationName, loopMode);
  }, [onLoopEnd]);
  const onStateChangedHandler = (0, _react.useCallback)(event => {
    const {
      stateMachineName: eventStateMachineName,
      stateName
    } = event.nativeEvent;
    onStateChanged === null || onStateChanged === void 0 || onStateChanged(eventStateMachineName, stateName);
  }, [onStateChanged]);
  const onRiveEventReceivedHandler = (0, _react.useCallback)(event => {
    const {
      riveEvent
    } = event.nativeEvent;
    onRiveEventReceived === null || onRiveEventReceived === void 0 || onRiveEventReceived(riveEvent);
  }, [onRiveEventReceived]);
  const onErrorHandler = (0, _react.useCallback)(event => {
    const {
      type,
      message
    } = event.nativeEvent;
    const rnRiveError = (0, _helpers.convertErrorFromNativeToRN)({
      type,
      message
    });
    if (rnRiveError !== null) {
      onError === null || onError === void 0 || onError(rnRiveError);
    }
  }, [onError]);
  const play = (0, _react.useCallback)((animationName = '', loop = _types.LoopMode.Auto, direction = _types.Direction.Auto, isStateMachine = false) => {
    _reactNative.UIManager.dispatchViewManagerCommand((0, _reactNative.findNodeHandle)(riveRef.current), _types.ViewManagerMethod.play, [animationName, loop, direction, isStateMachine]);
  }, []);
  const pause = (0, _react.useCallback)(() => {
    _reactNative.UIManager.dispatchViewManagerCommand((0, _reactNative.findNodeHandle)(riveRef.current), _types.ViewManagerMethod.pause, []);
  }, []);
  const stop = (0, _react.useCallback)(() => {
    _reactNative.UIManager.dispatchViewManagerCommand((0, _reactNative.findNodeHandle)(riveRef.current), _types.ViewManagerMethod.stop, []);
  }, []);
  const reset = (0, _react.useCallback)(() => {
    _reactNative.UIManager.dispatchViewManagerCommand((0, _reactNative.findNodeHandle)(riveRef.current), _types.ViewManagerMethod.reset, []);
  }, []);
  const fireState = (0, _react.useCallback)((triggerStateMachineName, inputName) => {
    _reactNative.UIManager.dispatchViewManagerCommand((0, _reactNative.findNodeHandle)(riveRef.current), _types.ViewManagerMethod.fireState, [triggerStateMachineName, inputName]);
  }, []);
  const setInputState = (0, _react.useCallback)((triggerStateMachineName, inputName, value) => {
    if (typeof value === 'boolean') {
      _reactNative.UIManager.dispatchViewManagerCommand((0, _reactNative.findNodeHandle)(riveRef.current), _types.ViewManagerMethod.setBooleanState, [triggerStateMachineName, inputName, value]);
    } else if (typeof value === 'number') {
      _reactNative.UIManager.dispatchViewManagerCommand((0, _reactNative.findNodeHandle)(riveRef.current), _types.ViewManagerMethod.setNumberState, [triggerStateMachineName, inputName, value]);
    }
  }, []);
  const getBooleanState = (0, _react.useCallback)(async inputName => {
    try {
      const result = await RiveReactNativeModule.getBooleanState((0, _reactNative.findNodeHandle)(riveRef.current), inputName);
      return result;
    } catch (error) {
      console.error(`Error getting boolean state for input: ${inputName}`, error);
      return null;
    }
  }, []);
  const getNumberState = (0, _react.useCallback)(async inputName => {
    try {
      const result = await RiveReactNativeModule.getNumberState((0, _reactNative.findNodeHandle)(riveRef.current), inputName);
      return result;
    } catch (error) {
      console.error(`Error getting number state for input: ${inputName}`, error);
      return null;
    }
  }, []);
  const getBooleanStateAtPath = (0, _react.useCallback)(async (inputName, path) => {
    try {
      const result = await RiveReactNativeModule.getBooleanStateAtPath((0, _reactNative.findNodeHandle)(riveRef.current), inputName, path);
      return result;
    } catch (error) {
      console.error(`Error getting boolean state for input: ${inputName} at path: ${path}`, error);
      return null;
    }
  }, []);
  const getNumberStateAtPath = (0, _react.useCallback)(async (inputName, path) => {
    try {
      const result = await RiveReactNativeModule.getNumberStateAtPath((0, _reactNative.findNodeHandle)(riveRef.current), inputName, path);
      return result;
    } catch (error) {
      console.error(`Error getting number state for input: ${inputName} at path: ${path}`, error);
      return null;
    }
  }, []);
  const fireStateAtPath = (0, _react.useCallback)((inputName, path) => {
    _reactNative.UIManager.dispatchViewManagerCommand((0, _reactNative.findNodeHandle)(riveRef.current), _types.ViewManagerMethod.fireStateAtPath, [inputName, path]);
  }, []);
  const setInputStateAtPath = (0, _react.useCallback)((inputName, value, path) => {
    if (typeof value === 'boolean') {
      _reactNative.UIManager.dispatchViewManagerCommand((0, _reactNative.findNodeHandle)(riveRef.current), _types.ViewManagerMethod.setBooleanStateAtPath, [inputName, value, path]);
    } else if (typeof value === 'number') {
      _reactNative.UIManager.dispatchViewManagerCommand((0, _reactNative.findNodeHandle)(riveRef.current), _types.ViewManagerMethod.setNumberStateAtPath, [inputName, value, path]);
    }
  }, []);
  const touchBegan = (0, _react.useCallback)((x, y) => {
    if (!isNaN(x) && !isNaN(y)) {
      _reactNative.UIManager.dispatchViewManagerCommand((0, _reactNative.findNodeHandle)(riveRef.current), _types.ViewManagerMethod.touchBegan, [x, y]);
    }
  }, []);
  const touchEnded = (0, _react.useCallback)((x, y) => {
    if (!isNaN(x) && !isNaN(y)) {
      _reactNative.UIManager.dispatchViewManagerCommand((0, _reactNative.findNodeHandle)(riveRef.current), _types.ViewManagerMethod.touchEnded, [x, y]);
    }
  }, []);
  const setTextRunValue = (0, _react.useCallback)((textRunName, textValue) => {
    if (textRunName) {
      _reactNative.UIManager.dispatchViewManagerCommand((0, _reactNative.findNodeHandle)(riveRef.current), _types.ViewManagerMethod.setTextRunValue, [textRunName, textValue]);
    }
  }, []);
  const setTextRunValueAtPath = (0, _react.useCallback)((textRunName, textValue, path) => {
    if (textRunName) {
      _reactNative.UIManager.dispatchViewManagerCommand((0, _reactNative.findNodeHandle)(riveRef.current), _types.ViewManagerMethod.setTextRunValueAtPath, [textRunName, textValue, path]);
    }
  }, []);
  const setBoolean = (0, _react.useCallback)((path, value) => {
    _reactNative.UIManager.dispatchViewManagerCommand((0, _reactNative.findNodeHandle)(riveRef.current), _types.ViewManagerMethod.setBooleanPropertyValue, [path, value]);
  }, []);
  const setString = (0, _react.useCallback)((path, value) => {
    _reactNative.UIManager.dispatchViewManagerCommand((0, _reactNative.findNodeHandle)(riveRef.current), _types.ViewManagerMethod.setStringPropertyValue, [path, value]);
  }, []);
  const setNumber = (0, _react.useCallback)((path, value) => {
    _reactNative.UIManager.dispatchViewManagerCommand((0, _reactNative.findNodeHandle)(riveRef.current), _types.ViewManagerMethod.setNumberPropertyValue, [path, value]);
  }, []);
  const setColor = (0, _react.useCallback)((path, color) => {
    let parsedColor = typeof color === 'string' ? (0, _utils.parseColor)(color) : color;
    _reactNative.UIManager.dispatchViewManagerCommand((0, _reactNative.findNodeHandle)(riveRef.current), _types.ViewManagerMethod.setColorPropertyValue, [path, parsedColor.r, parsedColor.g, parsedColor.b, parsedColor.a]);
  }, []);
  const setEnum = (0, _react.useCallback)((path, value) => {
    _reactNative.UIManager.dispatchViewManagerCommand((0, _reactNative.findNodeHandle)(riveRef.current), _types.ViewManagerMethod.setEnumPropertyValue, [path, value]);
  }, []);
  const setImage = (0, _react.useCallback)((path, base64Data) => {
    console.log('[RiveReactNative JS] setImage called:', {
      path,
      base64Length: base64Data.length,
      base64Preview: base64Data.substring(0, 50)
    });
    _reactNative.UIManager.dispatchViewManagerCommand((0, _reactNative.findNodeHandle)(riveRef.current), _types.ViewManagerMethod.setImagePropertyValue, [path, base64Data]);
  }, []);
  const setArtboard = (0, _react.useCallback)((path, artboardName) => {
    _reactNative.UIManager.dispatchViewManagerCommand((0, _reactNative.findNodeHandle)(riveRef.current), _types.ViewManagerMethod.setArtboardPropertyValue, [path, artboardName]);
  }, []);
  const trigger = (0, _react.useCallback)(path => {
    _reactNative.UIManager.dispatchViewManagerCommand((0, _reactNative.findNodeHandle)(riveRef.current), _types.ViewManagerMethod.fireTriggerProperty, [path]);
  }, []);
  const internalNativeEmitter = (0, _react.useCallback)(() => {
    if (!riveRef.current._propertyEmitter) {
      riveRef.current._propertyEmitter = new RiveNativeEventEmitter(nativeEventEmitter, riveRef);
    }
    return riveRef.current._propertyEmitter;
  }, [riveRef]);
  const viewTag = (0, _react.useCallback)(() => {
    return (0, _reactNative.findNodeHandle)(riveRef.current);
  }, [riveRef]);
  (0, _react.useImperativeHandle)(ref, () => ({
    setInputState,
    getBooleanState,
    getBooleanStateAtPath,
    getNumberState,
    getNumberStateAtPath,
    setInputStateAtPath,
    fireState,
    fireStateAtPath,
    play,
    pause,
    stop,
    reset,
    touchBegan,
    touchEnded,
    setTextRunValue,
    setTextRunValueAtPath,
    setBoolean,
    setString,
    setNumber,
    setColor,
    setEnum,
    setImage,
    setArtboard,
    trigger,
    internalNativeEmitter,
    viewTag
  }), [play, pause, stop, reset, setInputState, getBooleanState, getBooleanStateAtPath, getNumberState, getNumberStateAtPath, setInputStateAtPath, fireState, fireStateAtPath, touchBegan, touchEnded, setTextRunValue, setTextRunValueAtPath, setBoolean, setString, setNumber, setColor, setEnum, trigger, setImage, setArtboard, internalNativeEmitter, viewTag]);
  function transformFilesHandledMapping(mapping) {
    const transformedMapping = {};
    if (mapping === undefined) {
      return undefined;
    }
    Object.keys(mapping).forEach(key => {
      const option = mapping[key];
      transformedMapping[key] = {
        ...option,
        source: (0, _utils.parsePossibleSources)(option.source)
      };
    });
    return transformedMapping;
  }
  const convertedAssetHandledSources = transformFilesHandledMapping(referencedAssets);
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.container, style],
    ref: ref,
    testID: testID
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.children
  }, children), /*#__PURE__*/_react.default.createElement(_reactNative.TouchableWithoutFeedback, {
    onPressIn: event => touchBegan(event.nativeEvent.locationX, event.nativeEvent.locationY),
    onPressOut: event => touchEnded(event.nativeEvent.locationX, event.nativeEvent.locationY)
  }, /*#__PURE__*/_react.default.createElement(RiveViewManager, {
    ref: riveRef,
    resourceName: resourceName,
    isUserHandlingErrors: isUserHandlingErrors,
    autoplay: autoplay,
    fit: fit,
    layoutScaleFactor: layoutScaleFactor,
    url: url,
    style: styles.animation,
    onPlay: onPlayHandler,
    onPause: onPauseHandler,
    onStop: onStopHandler,
    onLoopEnd: onLoopEndHandler,
    onStateChanged: onStateChangedHandler,
    onRiveEventReceived: onRiveEventReceivedHandler,
    onError: onErrorHandler,
    alignment: alignment,
    artboardName: artboardName,
    referencedAssets: convertedAssetHandledSources,
    dataBinding: dataBinding,
    animationName: animationName,
    stateMachineName: stateMachineName
  })));
});
const styles = _reactNative.StyleSheet.create({
  children: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  container: {
    flexGrow: 1
  },
  animation: {
    flex: 1
  }
});
var _default = exports.default = RiveContainer;
//# sourceMappingURL=Rive.js.map