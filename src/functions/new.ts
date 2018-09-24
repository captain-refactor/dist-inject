import {Constructor} from "../interfaces";
import {CONTAINER} from "../global-instance";

export function New<T>(constructor: Constructor<T>): T {
    return CONTAINER.createInstance(constructor);
}