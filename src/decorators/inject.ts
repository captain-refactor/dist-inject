import {InjectableId} from "../provider";
import {INJECT} from "../symbols";

export function inject(injectableId: InjectableId) {
    return function (constructor, nothing, index) {
        if (!constructor[INJECT]) {
            constructor[INJECT] = [];
        }
        constructor[INJECT].push({index, injectableId} as InjectParameter);
    }
}

export interface InjectParameter {
    index: number;
    injectableId: InjectableId;
}