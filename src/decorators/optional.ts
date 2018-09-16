import {OPTIONAL} from "../symbols";

export function optional() {
    return function (constructor, property, index) {
        if (!constructor[OPTIONAL]) {
            constructor[OPTIONAL] = [];
        }
        constructor[OPTIONAL].push(index);
    }
}