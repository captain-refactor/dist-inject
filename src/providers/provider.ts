import {Constructor} from "../interfaces";
import {Container} from "../container";

export type InjectableId<T = any> = string | Constructor<T> | Symbol;

export interface ConfigurableDependency {
    injectId: InjectableId;
    optional: boolean;
}

export type Dependency = InjectableId | ConfigurableDependency;

export function isConfigurableDependency(obj: Dependency): obj is ConfigurableDependency {
    if (typeof obj === 'string') return false;
    return 'injectId' in obj && 'optional' in obj;
}

export interface Provider<T extends I = I, I = any> {
    getMe(container: Container): T
    match(id: InjectableId<I>): boolean;
}

export interface IFactory<T = any> {
    create(container: Container): T;
}

export function isFactory(obj: any): obj is IFactory {
    return 'create' in obj;
}