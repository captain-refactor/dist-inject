import {Constructor, IModule} from "../interfaces";
import {PROVIDERS} from "../symbols";
import {ProviderOptions} from "../providers";
import {injectable} from "./injectable";

export function provide(...toProvide: ProviderOptions[]) {
    return function (constructor: Constructor & Partial<IModule>) {
        injectable()(constructor);
        constructor[PROVIDERS] = toProvide;
    }
}