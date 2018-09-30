import {Constructor} from "../interfaces";

export type InjectableId<T = any> = string | Constructor<T> | Symbol;

export interface ConfigurableDependency {
    injectId: InjectableId;
    optional: boolean;
    factory: boolean;
}

export type Dependency = InjectableId | ConfigurableDependency;

export function isConfigurableDependency(obj: Dependency): obj is ConfigurableDependency {
    if (typeof obj === 'string') return false;
    return 'injectId' in obj;
}

export interface Provider<T extends I = I, I = any> {
    getMe(): T
    match(id: InjectableId<I>): boolean;
}

export function isProvider(input: any): input is Provider {
    return 'match' in input && 'getMe' in input;
}

export interface IFactory<T = any> {
    create(): T;
}

export function isFactory(obj: any): obj is IFactory {
    return 'create' in obj;
}