export let ViewManagerMethod = /*#__PURE__*/function (ViewManagerMethod) {
  ViewManagerMethod["play"] = "play";
  ViewManagerMethod["pause"] = "pause";
  ViewManagerMethod["stop"] = "stop";
  ViewManagerMethod["reset"] = "reset";
  ViewManagerMethod["fireState"] = "fireState";
  ViewManagerMethod["setBooleanState"] = "setBooleanState";
  ViewManagerMethod["getBooleanState"] = "getBooleanState";
  ViewManagerMethod["getBooleanStateAtPath"] = "getBooleanStateAtPath";
  ViewManagerMethod["setNumberState"] = "setNumberState";
  ViewManagerMethod["getNumberState"] = "getNumberState";
  ViewManagerMethod["getNumberStateAtPath"] = "getNumberStateAtPath";
  ViewManagerMethod["fireStateAtPath"] = "fireStateAtPath";
  ViewManagerMethod["setBooleanStateAtPath"] = "setBooleanStateAtPath";
  ViewManagerMethod["setNumberStateAtPath"] = "setNumberStateAtPath";
  ViewManagerMethod["touchBegan"] = "touchBegan";
  ViewManagerMethod["touchEnded"] = "touchEnded";
  ViewManagerMethod["setTextRunValue"] = "setTextRunValue";
  ViewManagerMethod["setTextRunValueAtPath"] = "setTextRunValueAtPath";
  ViewManagerMethod["setBooleanPropertyValue"] = "setBooleanPropertyValue";
  ViewManagerMethod["setStringPropertyValue"] = "setStringPropertyValue";
  ViewManagerMethod["setNumberPropertyValue"] = "setNumberPropertyValue";
  ViewManagerMethod["setColorPropertyValue"] = "setColorPropertyValue";
  ViewManagerMethod["setEnumPropertyValue"] = "setEnumPropertyValue";
  ViewManagerMethod["setImagePropertyValue"] = "setImagePropertyValue";
  ViewManagerMethod["setBase64ImagePropertyValue"] = "setBase64ImagePropertyValue";
  ViewManagerMethod["setArtboardPropertyValue"] = "setArtboardPropertyValue";
  ViewManagerMethod["fireTriggerProperty"] = "fireTriggerProperty";
  return ViewManagerMethod;
}({});
export let Fit = /*#__PURE__*/function (Fit) {
  Fit["Cover"] = "cover";
  Fit["Contain"] = "contain";
  Fit["Fill"] = "fill";
  Fit["FitWidth"] = "fitWidth";
  Fit["FitHeight"] = "fitHeight";
  Fit["None"] = "none";
  Fit["ScaleDown"] = "scaleDown";
  Fit["Layout"] = "layout";
  return Fit;
}({});
export let Alignment = /*#__PURE__*/function (Alignment) {
  Alignment["TopLeft"] = "topLeft";
  Alignment["TopCenter"] = "topCenter";
  Alignment["TopRight"] = "topRight";
  Alignment["CenterLeft"] = "centerLeft";
  Alignment["Center"] = "center";
  Alignment["CenterRight"] = "centerRight";
  Alignment["BottomLeft"] = "bottomLeft";
  Alignment["BottomCenter"] = "bottomCenter";
  Alignment["BottomRight"] = "bottomRight";
  return Alignment;
}({});
export let LoopMode = /*#__PURE__*/function (LoopMode) {
  LoopMode["OneShot"] = "oneShot";
  LoopMode["Loop"] = "loop";
  LoopMode["PingPong"] = "pingPong";
  LoopMode["Auto"] = "auto";
  return LoopMode;
}({});
export let Direction = /*#__PURE__*/function (Direction) {
  Direction["Backwards"] = "backwards";
  Direction["Auto"] = "auto";
  Direction["Forwards"] = "forwards";
  return Direction;
}({});
export let RiveRendererIOS = /*#__PURE__*/function (RiveRendererIOS) {
  RiveRendererIOS["Rive"] = "rive";
  RiveRendererIOS["CoreGraphics"] = "coreGraphics";
  return RiveRendererIOS;
}({});
export let RiveRendererAndroid = /*#__PURE__*/function (RiveRendererAndroid) {
  RiveRendererAndroid["Rive"] = "rive";
  RiveRendererAndroid["Canvas"] = "canvas";
  return RiveRendererAndroid;
}({});
export let RNRiveErrorType = /*#__PURE__*/function (RNRiveErrorType) {
  RNRiveErrorType["FileNotFound"] = "FileNotFound";
  RNRiveErrorType["UnsupportedRuntimeVersion"] = "UnsupportedRuntimeVersion";
  RNRiveErrorType["IncorrectRiveFileUrl"] = "IncorrectRiveFileUrl";
  RNRiveErrorType["IncorrectAnimationName"] = "IncorrectAnimationName";
  RNRiveErrorType["MalformedFile"] = "MalformedFile";
  RNRiveErrorType["IncorrectArtboardName"] = "IncorrectArtboardName";
  RNRiveErrorType["IncorrectStateMachineName"] = "IncorrectStateMachineName";
  RNRiveErrorType["IncorrectStateMachineInput"] = "IncorrectStateMachineInput";
  RNRiveErrorType["TextRunNotFoundError"] = "TextRunNotFoundError";
  RNRiveErrorType["DataBindingError"] = "DataBindingError";
  RNRiveErrorType["UnusedReferencedAssetError"] = "UnusedReferencedAssetError";
  return RNRiveErrorType;
}({});
export let PropertyType = /*#__PURE__*/function (PropertyType) {
  PropertyType["Number"] = "number";
  PropertyType["String"] = "string";
  PropertyType["Boolean"] = "boolean";
  PropertyType["Color"] = "color";
  PropertyType["Trigger"] = "trigger";
  PropertyType["Enum"] = "enum";
  PropertyType["Image"] = "image";
  PropertyType["Artboard"] = "artboard";
  return PropertyType;
}({});
export const AutoBind = value => ({
  type: 'autobind',
  value
});
export const BindByIndex = value => ({
  type: 'index',
  value
});
export const BindByName = value => ({
  type: 'name',
  value
});
export const BindEmpty = () => ({
  type: 'empty'
});
//# sourceMappingURL=types.js.map