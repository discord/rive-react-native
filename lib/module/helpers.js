import { RNRiveErrorType } from './types';
export function isEnum(enumType, enumValue) {
  return Object.values(enumType).includes(enumValue);
}
export function convertErrorFromNativeToRN(errorFromNative) {
  if (isEnum(RNRiveErrorType, errorFromNative.type)) {
    return {
      type: errorFromNative.type,
      message: errorFromNative.message
    };
  }
  return null;
}
//# sourceMappingURL=helpers.js.map