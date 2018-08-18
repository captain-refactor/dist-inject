import {Constructor} from "./interfaces";

export type InjectableId<T = any> = string | Constructor<T> | Symbol;

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

