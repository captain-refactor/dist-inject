import {Constructor} from "./interfaces";
import {isString} from "util";

export type InjectableId<T = any> = string | Constructor<T> | Symbol;

export interface ConfigurableDependency {
    injectId: InjectableId;
    optional: boolean;
}

export type Dependency = InjectableId | ConfigurableDependency;

export function isConfigurableDependency(obj: Dependency): obj is ConfigurableDependency {
    if(typeof obj === 'string') return false;
    return 'injectId' in obj && 'optional' in obj;
}

export type Provider<P = any, T = any> = ValueProvider<P, T> | ClassProvider<P, T>;

export class ValueProvider<P = any, T = any> {
    constructor(public provide: InjectableId<P>,
                public value: T) {
    }
}

export class ClassProvider<P = any, T = any> {
    constructor(public provide: InjectableId<P>,
                public useClass: Constructor<T>,
                public singleton: boolean = true) {
    }
}

