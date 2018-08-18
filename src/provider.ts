export type Constructor<T = any> = {
    new(...args): T;
}

export type InjectableId<T = any> = string | Constructor<T>;

export type Provider<P = any, T = any> = ValueProvider<P, T> | ClassProvider<P, T>;

export class ValueProvider<P = any, T = any> {
    provide: InjectableId<P>;
    value: T;

    constructor(provide: InjectableId<P>, value: T) {
        this.provide = provide;
        this.value = value;
    }
}

export class ClassProvider<P = any, T = any> {
    provide: InjectableId<P>;
    useClass: Constructor<T>;

    constructor(provide: InjectableId<P>, useClass: Constructor<T>) {
        this.provide = provide;
        this.useClass = useClass;
    }
}

