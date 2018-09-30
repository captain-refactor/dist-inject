import {Constructor, IInjectable} from "../interfaces";
import {DEPENDENCIES, FACTORY, INJECT, OPTIONAL} from "../symbols";
import {InjectableId} from "..";

type InjectableConstructor<T> = Constructor<T> & Partial<IInjectable>

export function injectable<T>() {
    return function (constructor: (InjectableConstructor<T>) | Object, propertyName?: string) {
        let func: Partial<IInjectable> = propertyName ? (constructor as any)[propertyName] : constructor;
        let dependencies: InjectableId[] = (Reflect as any).getMetadata('design:paramtypes', func) || [];
        func[DEPENDENCIES] = dependencies;

        let optionalIndexes = func[OPTIONAL] || new Set();
        let factories = func[FACTORY] || new Set();
        let injects = func[INJECT] || new Map<number, InjectableId>();

        for (let index = 0; index < dependencies.length; index++) {
            func[DEPENDENCIES][index] = {
                injectId: injects.get(index) || dependencies[index],
                optional: optionalIndexes.has(index),
                factory: factories.has(index),
            };
        }
        // cleaning
        delete func[OPTIONAL];
        delete func[FACTORY];
        delete func[INJECT];
    }
}