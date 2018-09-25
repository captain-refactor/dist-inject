import {Constructor, IInjectable} from "../interfaces";
import {DEPENDENCIES, FACTORY, INJECT, OPTIONAL} from "../symbols";
import {InjectableId} from "..";


export function injectable<T>() {
    return function (constructor: Constructor<T> & Partial<IInjectable>) {
        let dependencies: InjectableId[] = Reflect.getMetadata('design:paramtypes', constructor) || [];
        constructor[DEPENDENCIES] = dependencies;

        let optionalIndexes = constructor[OPTIONAL] || new Set();
        let factories = constructor[FACTORY] || new Set();
        let injects = constructor[INJECT] || new Map<number, InjectableId>();

        for (let index = 0; index < dependencies.length; index++) {
            constructor[DEPENDENCIES][index] = {
                injectId: injects.get(index) || dependencies[index],
                optional: optionalIndexes.has(index),
                factory: factories.has(index),
            };
        }
        // cleaning
        delete constructor[OPTIONAL];
        delete constructor[FACTORY];
        delete constructor[INJECT];

    }
}