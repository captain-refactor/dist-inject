import {InjectableId, isProvider, Provider} from "./provider";
import {ClassProvider} from "./class-provider";
import {ValueProvider} from "./value-provider";
import {Constructor} from "../interfaces";
import {RedirectProvider} from "./redirect-provider";

export interface ValueProviderOptions<P = any, T extends P = P> {
    provide: InjectableId<P>;
    value: T;
}

export interface ClassProviderOptions<P = any, T extends P = P> {
    provide: InjectableId<P>;
    useClass: Constructor<T>;
    singleton?: boolean;
}

export interface RedirectProviderOptions<P = any, T extends P = any> {
    provide: InjectableId<P>
    useProvider: InjectableId<T>
}

export type ProviderOptions = Constructor | ClassProviderOptions | ValueProviderOptions | RedirectProviderOptions;


export function createProvider(input: ProviderOptions | Provider): Provider {
    if (isProvider(input)) return input;
    if (isConstructor(input)) {
        return createClassProvider({useClass: input, provide: input});
    }
    if (isValueProviderOptions(input)) {
        return new ValueProvider(input.provide, input.value);
    }
    if (isClassProviderOptions(input)) {
        return new ClassProvider(input.provide, input.useClass, input.singleton);
    }
    if (isRedirectProviderOptions(input)) {
        return new RedirectProvider(input.provide, input.useProvider);
    }
    throw new Error('something went wrong');
}

export function createClassProvider(options: ClassProviderOptions): ClassProvider {


    return new ClassProvider(options.provide, options.useClass, options.singleton);
}

export function isConstructor<T = any>(constructor): constructor is Constructor<T> {
    return 'prototype' in constructor && 'isPrototypeOf' in constructor;
}

export function isValueProviderOptions(provider): provider is ValueProviderOptions {
    return 'value' in provider && 'provide' in provider;
}

export function isClassProviderOptions(provider): provider is ClassProviderOptions {
    return 'provide' in provider && 'useClass' in provider;
}

export function isRedirectProviderOptions(options): options is RedirectProviderOptions {
    return 'provide' in options && 'useProvider' in options;
}