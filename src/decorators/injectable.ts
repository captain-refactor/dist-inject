import {Constructor, IInjectable} from "../interfaces";
import {DEPENDENCIES, INJECT, OPTIONAL} from "../symbols";
import 'reflect-metadata';
import {isConfigurableDependency} from "../provider";
import {InjectParameter} from "./inject";


export function injectable<T>() {
    return function (constructor: Constructor<T> & Partial<IInjectable>) {
        constructor[DEPENDENCIES] = Reflect.getMetadata('design:paramtypes', constructor);
        let injects: InjectParameter[] = constructor[INJECT];
        if (injects) {
            for (let inject of injects) {
                constructor[DEPENDENCIES][inject.index] = inject.injectableId;
            }
            // cleaning
            delete constructor[INJECT];
        }
        let optionalIndexes = constructor[OPTIONAL];
        if (optionalIndexes) {
            for (let index of optionalIndexes) {
                let dep = constructor[DEPENDENCIES][index];
                if (isConfigurableDependency(dep)) {
                    dep.optional = true;
                } else {
                    constructor[DEPENDENCIES][index] = {
                        injectId: dep,
                        optional: true
                    };
                }
            }
            // cleaning
            delete constructor[OPTIONAL];
        }
    }
}