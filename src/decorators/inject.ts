import {InjectableId} from "../providers/provider";
import {INJECT} from "../symbols";

export function inject(injectableId: InjectableId) {
    return function (constructor, nothing, index) {
        if (!constructor[INJECT]) {
            constructor[INJECT] = new Map();
        }
        constructor[INJECT].set(index, injectableId);
    }
}

export interface InjectParameter {
    index: number;
    injectableId: InjectableId;
}