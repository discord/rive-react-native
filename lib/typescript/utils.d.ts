import type { FileAssetSource, PropertyType, RiveAssetPropType, RiveRGBA } from './types';
declare function parsePossibleSources(source: RiveAssetPropType): FileAssetSource;
declare function parseColor(color: string): RiveRGBA;
declare function intToRiveRGBA(colorValue: number): RiveRGBA;
export { parsePossibleSources, parseColor, intToRiveRGBA };
export declare const getPropertyTypeString: (propertyType: PropertyType) => string;
//# sourceMappingURL=utils.d.ts.map