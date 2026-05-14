import React from 'react';
import { ViewStyle, NativeSyntheticEvent, StyleProp, NativeEventEmitter } from 'react-native';
import { RiveRef, LoopMode, RNRiveError, RiveGeneralEvent, RiveOpenUrlEvent, RiveRendererInterface, FilesHandledMapping, RiveRGBA, PropertyType, DataBindBy } from './types';
import { XOR } from './helpers';
import { Alignment, Fit } from './types';
export type PropertyCallback = (value: any) => void;
export declare class RiveNativeEventEmitter {
    emitter: NativeEventEmitter;
    riveRef: React.MutableRefObject<any>;
    constructor(emitter: NativeEventEmitter, riveRef: React.MutableRefObject<any>);
    private nativeSubscriptions;
    private callbacks;
    addListener<T>(path: string, propertyType: PropertyType, reactTag: number | null, callback: (value: T) => void): void;
    generatePropertyKey(path: string, propertyType: PropertyType, reactTag: number): string;
    removeListener<T>(path: string, propertyType: PropertyType, reactTag: number | null, callback: (value: T) => void): void;
}
export declare function useRive(): [(node: RiveRef) => void, RiveRef | null];
export declare function useRiveBoolean(riveRef: RiveRef | null, path: string): [boolean | undefined, (value: boolean) => void];
export declare function useRiveString(riveRef: RiveRef | null, path: string): [string | undefined, (value: string) => void];
export declare function useRiveNumber(riveRef: RiveRef | null, path: string): [number | undefined, (value: number) => void];
export declare function useRiveEnum(riveRef: RiveRef | null, path: string): [string | undefined, (value: string) => void];
export declare function useRiveColor(riveRef: RiveRef | null, path: string): [RiveRGBA | undefined, (value: RiveRGBA | string) => void];
export declare function useRiveTrigger(riveRef: RiveRef | null, path: string, onTrigger?: () => void): (() => void) | undefined;
export declare const RiveRenderer: RiveRendererInterface;
type RiveProps = {
    onPlay?: (event: NativeSyntheticEvent<{
        animationName: string;
        isStateMachine: boolean;
    }>) => void;
    onPause?: (event: NativeSyntheticEvent<{
        animationName: string;
        isStateMachine: boolean;
    }>) => void;
    onStop?: (event: NativeSyntheticEvent<{
        animationName: string;
        isStateMachine: boolean;
    }>) => void;
    onLoopEnd?: (event: NativeSyntheticEvent<{
        animationName: string;
        loopMode: LoopMode;
    }>) => void;
    onStateChanged?: (event: NativeSyntheticEvent<{
        stateMachineName: string;
        stateName: string;
    }>) => void;
    onRiveEventReceived?: (event: NativeSyntheticEvent<{
        riveEvent: RiveGeneralEvent | RiveOpenUrlEvent;
    }>) => void;
    onError?: (event: NativeSyntheticEvent<{
        type: string;
        message: string;
    }>) => void;
    onReady?: () => void;
    isUserHandlingErrors: boolean;
    autoplay?: boolean;
    fit: Fit;
    layoutScaleFactor?: number;
    alignment: Alignment;
    artboardName?: string;
    referencedAssets?: FilesHandledMapping;
    dataBinding?: DataBindBy;
    animationName?: string;
    stateMachineName?: string;
    ref: any;
    resourceName?: string;
    url?: string;
    style?: StyleProp<ViewStyle>;
    testID?: string;
};
type Props = {
    onPlay?: (animationName: string, isStateMachine: boolean) => void;
    onPause?: (animationName: string, isStateMachine: boolean) => void;
    onStop?: (animationName: string, isStateMachine: boolean) => void;
    onLoopEnd?: (animationName: string, loopMode: LoopMode) => void;
    onStateChanged?: (stateMachineName: string, stateName: string) => void;
    onRiveEventReceived?: (event: RiveGeneralEvent | RiveOpenUrlEvent) => void;
    onError?: (rnRiveError: RNRiveError) => void;
    onReady?: () => void;
    fit?: Fit;
    layoutScaleFactor?: number;
    style?: ViewStyle;
    testID?: string;
    alignment?: Alignment;
    artboardName?: string;
    /**
     * @experimental This is an experimental feature and may change without a major version update (breaking change).
     */
    referencedAssets?: FilesHandledMapping;
    dataBinding?: DataBindBy;
    animationName?: string;
    stateMachineName?: string;
    autoplay?: boolean;
    children?: React.ReactNode;
} & XOR<XOR<{
    resourceName: string;
}, {
    url: string;
}>, {
    source: number | {
        uri: string;
    };
}>;
export declare const RiveViewManager: import("react-native").HostComponent<RiveProps>;
declare const RiveContainer: React.ForwardRefExoticComponent<Props & React.RefAttributes<RiveRef>>;
export default RiveContainer;
//# sourceMappingURL=Rive.d.ts.map