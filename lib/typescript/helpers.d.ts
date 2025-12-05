import { RNRiveError } from './types';
export type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
export type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;
export declare function isEnum<EnumType extends {
    [key: string]: string;
}>(enumType: EnumType, enumValue: string): enumValue is EnumType[keyof EnumType];
export declare function convertErrorFromNativeToRN(errorFromNative: {
    type: string;
    message: string;
}): RNRiveError | null;
//# sourceMappingURL=helpers.d.ts.map