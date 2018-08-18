import {Constructor, IInjectable} from "../interfaces";
import {DEPENDENCIES} from "../symbols";

export function injectable<T>() {
    return function (constructor: Constructor<T> & Partial<IInjectable>) {
        constructor[DEPENDENCIES] = Reflect.getMetadata('design:paramtypes', constructor);
    }
}