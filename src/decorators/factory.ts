import {FACTORY} from "../symbols";
import {InjectableId} from "../providers/provider";
import {inject} from "./inject";

export function factory(id: InjectableId) {
    if (!id) throw Error('injectable id isn\'t specified');
    return function (constructor, nothing, index) {
        inject(id)(constructor, nothing, index);
        if (!constructor[FACTORY]) {
            constructor[FACTORY] = new Set();
        }
        constructor[FACTORY].add(index);
    }
}