import {OPTIONAL} from "../symbols";

export function optional() {
    return function (constructor, property, index) {
        if (!constructor[OPTIONAL]) {
            constructor[OPTIONAL] = new Set();
        }
        constructor[OPTIONAL].add(index);
    }
}