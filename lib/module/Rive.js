import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
// This import path isn't handled by @types/react-native
// @ts-ignore
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import { requireNativeComponent, UIManager, findNodeHandle, StyleSheet, View, TouchableWithoutFeedback, NativeModules, NativeEventEmitter, Platform } from 'react-native';
import { Direction, LoopMode, ViewManagerMethod, PropertyType, AutoBind } from './types';
import { convertErrorFromNativeToRN } from './helpers';
import { Alignment, Fit } from './types';
import { getPropertyTypeString, intToRiveRGBA, parseColor, parsePossibleSources } from './utils';
export class RiveNativeEventEmitter {
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
      UIManager.dispatchViewManagerCommand(reactTag, 'registerPropertyListener',
      // Name of the native command
      [path, getPropertyTypeString(propertyType)]);
      this.nativeSubscriptions[key] = subscription;
    }
  }
  generatePropertyKey(path, propertyType, reactTag) {
    return `${getPropertyTypeString(propertyType)}:${path}:${reactTag}`;
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
export function useRive() {
  const [ref, setRef] = useState(null);
  const setRiveRef = useCallback(node => {
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
export function useRiveBoolean(riveRef, path) {
  return useRivePropertyListener(riveRef, path, PropertyType.Boolean);
}
export function useRiveString(riveRef, path) {
  return useRivePropertyListener(riveRef, path, PropertyType.String);
}
export function useRiveNumber(riveRef, path) {
  return useRivePropertyListener(riveRef, path, PropertyType.Number);
}
export function useRiveEnum(riveRef, path) {
  return useRivePropertyListener(riveRef, path, PropertyType.Enum);
}
export function useRiveColor(riveRef, path) {
  return useRivePropertyListener(riveRef, path, PropertyType.Color);
}
export function useRiveTrigger(riveRef, path, onTrigger) {
  const triggerCallback = useCallback(() => {
    onTrigger === null || onTrigger === void 0 || onTrigger();
  }, [onTrigger]);
  useEffect(() => {
    var _riveRef$internalNati;
    const listener = riveRef === null || riveRef === void 0 || (_riveRef$internalNati = riveRef.internalNativeEmitter) === null || _riveRef$internalNati === void 0 ? void 0 : _riveRef$internalNati.call(riveRef);
    if (!listener) return () => {};
    const reactTag = findNodeHandle(riveRef.viewTag());
    if (!reactTag) return () => {};
    listener.addListener(path, PropertyType.Trigger, reactTag, triggerCallback);
    return () => {
      listener.removeListener(path, PropertyType.Trigger, reactTag, triggerCallback);
    };
  }, [riveRef, path, triggerCallback]);

  // Function to fire the trigger
  const trigger = useCallback(() => {
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
  const [value, setValue] = useState(undefined);

  // Listener callback to update state for non-color properties
  const listenerCallback = useCallback(newValue => {
    setValue(newValue);
  }, []);

  // Listener callback to update state for color properties
  const listenerCallbackWithColor = useCallback(newValue => {
    const rgbaValue = intToRiveRGBA(newValue);
    setValue(rgbaValue);
  }, []);
  useEffect(() => {
    var _riveRef$internalNati2;
    const listener = riveRef === null || riveRef === void 0 || (_riveRef$internalNati2 = riveRef.internalNativeEmitter) === null || _riveRef$internalNati2 === void 0 ? void 0 : _riveRef$internalNati2.call(riveRef);
    if (!listener) return () => {};
    const reactTag = findNodeHandle(riveRef.viewTag());
    if (propertyType === PropertyType.Color) {
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
  const setPropertyValue = useCallback(newValue => {
    if (!riveRef) {
      if (__DEV__) {
        console.warn(`[Rive] Tried to set property "${path}" before riveRef was available.`);
      }
      return;
    }
    switch (propertyType) {
      case PropertyType.Number:
        riveRef.setNumber(path, newValue);
        break;
      case PropertyType.Boolean:
        riveRef.setBoolean(path, newValue);
        break;
      case PropertyType.String:
        riveRef.setString(path, newValue);
        break;
      case PropertyType.Enum:
        riveRef.setEnum(path, newValue);
        break;
      case PropertyType.Color:
        const parsedColor = typeof newValue === 'string' ? parseColor(newValue) : newValue;
        riveRef.setColor(path, parsedColor);
        break;
      case PropertyType.Image:
        riveRef.setImage(path, newValue);
        break;
      case PropertyType.Artboard:
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
} = NativeModules;
const nativeEventEmitter = Platform.OS === 'android' ? new NativeEventEmitter() // Not needed for Android
: new NativeEventEmitter(RiveReactNativeEventModule);
export const RiveRenderer = RiveReactNativeRendererModule;
const VIEW_NAME = 'RiveReactNativeView';
export const RiveViewManager = requireNativeComponent(VIEW_NAME);
const RiveContainer = /*#__PURE__*/React.forwardRef(({
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
  alignment = Alignment.Center,
  fit = Fit.Contain,
  layoutScaleFactor,
  artboardName,
  referencedAssets: referencedAssets,
  dataBinding = AutoBind(false),
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
  } = useMemo(() => {
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
    const assetURI = assetID ? (_resolveAssetSource = resolveAssetSource(assetID)) === null || _resolveAssetSource === void 0 ? void 0 : _resolveAssetSource.uri : sourceURI;
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
  const riveRef = useRef(null);
  const isUserHandlingErrors = onError !== undefined;
  const onPlayHandler = useCallback(event => {
    const {
      animationName: eventAnimationName,
      isStateMachine
    } = event.nativeEvent;
    onPlay === null || onPlay === void 0 || onPlay(eventAnimationName, isStateMachine);
  }, [onPlay]);
  const onPauseHandler = useCallback(event => {
    const {
      animationName: eventAnimationName,
      isStateMachine
    } = event.nativeEvent;
    onPause === null || onPause === void 0 || onPause(eventAnimationName, isStateMachine);
  }, [onPause]);
  const onStopHandler = useCallback(event => {
    const {
      animationName: eventAnimationName,
      isStateMachine
    } = event.nativeEvent;
    onStop === null || onStop === void 0 || onStop(eventAnimationName, isStateMachine);
  }, [onStop]);
  const onLoopEndHandler = useCallback(event => {
    const {
      animationName: eventAnimationName,
      loopMode
    } = event.nativeEvent;
    onLoopEnd === null || onLoopEnd === void 0 || onLoopEnd(eventAnimationName, loopMode);
  }, [onLoopEnd]);
  const onStateChangedHandler = useCallback(event => {
    const {
      stateMachineName: eventStateMachineName,
      stateName
    } = event.nativeEvent;
    onStateChanged === null || onStateChanged === void 0 || onStateChanged(eventStateMachineName, stateName);
  }, [onStateChanged]);
  const onRiveEventReceivedHandler = useCallback(event => {
    const {
      riveEvent
    } = event.nativeEvent;
    onRiveEventReceived === null || onRiveEventReceived === void 0 || onRiveEventReceived(riveEvent);
  }, [onRiveEventReceived]);
  const onErrorHandler = useCallback(event => {
    const {
      type,
      message
    } = event.nativeEvent;
    const rnRiveError = convertErrorFromNativeToRN({
      type,
      message
    });
    if (rnRiveError !== null) {
      onError === null || onError === void 0 || onError(rnRiveError);
    }
  }, [onError]);
  const play = useCallback((animationName = '', loop = LoopMode.Auto, direction = Direction.Auto, isStateMachine = false) => {
    UIManager.dispatchViewManagerCommand(findNodeHandle(riveRef.current), ViewManagerMethod.play, [animationName, loop, direction, isStateMachine]);
  }, []);
  const pause = useCallback(() => {
    UIManager.dispatchViewManagerCommand(findNodeHandle(riveRef.current), ViewManagerMethod.pause, []);
  }, []);
  const stop = useCallback(() => {
    UIManager.dispatchViewManagerCommand(findNodeHandle(riveRef.current), ViewManagerMethod.stop, []);
  }, []);
  const reset = useCallback(() => {
    UIManager.dispatchViewManagerCommand(findNodeHandle(riveRef.current), ViewManagerMethod.reset, []);
  }, []);
  const fireState = useCallback((triggerStateMachineName, inputName) => {
    UIManager.dispatchViewManagerCommand(findNodeHandle(riveRef.current), ViewManagerMethod.fireState, [triggerStateMachineName, inputName]);
  }, []);
  const setInputState = useCallback((triggerStateMachineName, inputName, value) => {
    if (typeof value === 'boolean') {
      UIManager.dispatchViewManagerCommand(findNodeHandle(riveRef.current), ViewManagerMethod.setBooleanState, [triggerStateMachineName, inputName, value]);
    } else if (typeof value === 'number') {
      UIManager.dispatchViewManagerCommand(findNodeHandle(riveRef.current), ViewManagerMethod.setNumberState, [triggerStateMachineName, inputName, value]);
    }
  }, []);
  const getBooleanState = useCallback(async inputName => {
    try {
      const result = await RiveReactNativeModule.getBooleanState(findNodeHandle(riveRef.current), inputName);
      return result;
    } catch (error) {
      console.error(`Error getting boolean state for input: ${inputName}`, error);
      return null;
    }
  }, []);
  const getNumberState = useCallback(async inputName => {
    try {
      const result = await RiveReactNativeModule.getNumberState(findNodeHandle(riveRef.current), inputName);
      return result;
    } catch (error) {
      console.error(`Error getting number state for input: ${inputName}`, error);
      return null;
    }
  }, []);
  const getBooleanStateAtPath = useCallback(async (inputName, path) => {
    try {
      const result = await RiveReactNativeModule.getBooleanStateAtPath(findNodeHandle(riveRef.current), inputName, path);
      return result;
    } catch (error) {
      console.error(`Error getting boolean state for input: ${inputName} at path: ${path}`, error);
      return null;
    }
  }, []);
  const getNumberStateAtPath = useCallback(async (inputName, path) => {
    try {
      const result = await RiveReactNativeModule.getNumberStateAtPath(findNodeHandle(riveRef.current), inputName, path);
      return result;
    } catch (error) {
      console.error(`Error getting number state for input: ${inputName} at path: ${path}`, error);
      return null;
    }
  }, []);
  const fireStateAtPath = useCallback((inputName, path) => {
    UIManager.dispatchViewManagerCommand(findNodeHandle(riveRef.current), ViewManagerMethod.fireStateAtPath, [inputName, path]);
  }, []);
  const setInputStateAtPath = useCallback((inputName, value, path) => {
    if (typeof value === 'boolean') {
      UIManager.dispatchViewManagerCommand(findNodeHandle(riveRef.current), ViewManagerMethod.setBooleanStateAtPath, [inputName, value, path]);
    } else if (typeof value === 'number') {
      UIManager.dispatchViewManagerCommand(findNodeHandle(riveRef.current), ViewManagerMethod.setNumberStateAtPath, [inputName, value, path]);
    }
  }, []);
  const touchBegan = useCallback((x, y) => {
    if (!isNaN(x) && !isNaN(y)) {
      UIManager.dispatchViewManagerCommand(findNodeHandle(riveRef.current), ViewManagerMethod.touchBegan, [x, y]);
    }
  }, []);
  const touchEnded = useCallback((x, y) => {
    if (!isNaN(x) && !isNaN(y)) {
      UIManager.dispatchViewManagerCommand(findNodeHandle(riveRef.current), ViewManagerMethod.touchEnded, [x, y]);
    }
  }, []);
  const setTextRunValue = useCallback((textRunName, textValue) => {
    if (textRunName) {
      UIManager.dispatchViewManagerCommand(findNodeHandle(riveRef.current), ViewManagerMethod.setTextRunValue, [textRunName, textValue]);
    }
  }, []);
  const setTextRunValueAtPath = useCallback((textRunName, textValue, path) => {
    if (textRunName) {
      UIManager.dispatchViewManagerCommand(findNodeHandle(riveRef.current), ViewManagerMethod.setTextRunValueAtPath, [textRunName, textValue, path]);
    }
  }, []);
  const setBoolean = useCallback((path, value) => {
    UIManager.dispatchViewManagerCommand(findNodeHandle(riveRef.current), ViewManagerMethod.setBooleanPropertyValue, [path, value]);
  }, []);
  const setString = useCallback((path, value) => {
    UIManager.dispatchViewManagerCommand(findNodeHandle(riveRef.current), ViewManagerMethod.setStringPropertyValue, [path, value]);
  }, []);
  const setNumber = useCallback((path, value) => {
    UIManager.dispatchViewManagerCommand(findNodeHandle(riveRef.current), ViewManagerMethod.setNumberPropertyValue, [path, value]);
  }, []);
  const setColor = useCallback((path, color) => {
    let parsedColor = typeof color === 'string' ? parseColor(color) : color;
    UIManager.dispatchViewManagerCommand(findNodeHandle(riveRef.current), ViewManagerMethod.setColorPropertyValue, [path, parsedColor.r, parsedColor.g, parsedColor.b, parsedColor.a]);
  }, []);
  const setEnum = useCallback((path, value) => {
    UIManager.dispatchViewManagerCommand(findNodeHandle(riveRef.current), ViewManagerMethod.setEnumPropertyValue, [path, value]);
  }, []);
  const setImage = useCallback((path, base64Data) => {
    console.log('[RiveReactNative JS] setImage called:', {
      path,
      base64Length: base64Data.length,
      base64Preview: base64Data.substring(0, 50)
    });
    UIManager.dispatchViewManagerCommand(findNodeHandle(riveRef.current), ViewManagerMethod.setImagePropertyValue, [path, base64Data]);
  }, []);
  const setArtboard = useCallback((path, artboardName) => {
    UIManager.dispatchViewManagerCommand(findNodeHandle(riveRef.current), ViewManagerMethod.setArtboardPropertyValue, [path, artboardName]);
  }, []);
  const trigger = useCallback(path => {
    UIManager.dispatchViewManagerCommand(findNodeHandle(riveRef.current), ViewManagerMethod.fireTriggerProperty, [path]);
  }, []);
  const internalNativeEmitter = useCallback(() => {
    if (!riveRef.current._propertyEmitter) {
      riveRef.current._propertyEmitter = new RiveNativeEventEmitter(nativeEventEmitter, riveRef);
    }
    return riveRef.current._propertyEmitter;
  }, [riveRef]);
  const viewTag = useCallback(() => {
    return findNodeHandle(riveRef.current);
  }, [riveRef]);
  useImperativeHandle(ref, () => ({
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
        source: parsePossibleSources(option.source)
      };
    });
    return transformedMapping;
  }
  const convertedAssetHandledSources = transformFilesHandledMapping(referencedAssets);
  return /*#__PURE__*/React.createElement(View, {
    style: [styles.container, style],
    ref: ref,
    testID: testID
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.children
  }, children), /*#__PURE__*/React.createElement(TouchableWithoutFeedback, {
    onPressIn: event => touchBegan(event.nativeEvent.locationX, event.nativeEvent.locationY),
    onPressOut: event => touchEnded(event.nativeEvent.locationX, event.nativeEvent.locationY)
  }, /*#__PURE__*/React.createElement(RiveViewManager, {
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
const styles = StyleSheet.create({
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
export default RiveContainer;
//# sourceMappingURL=Rive.js.map