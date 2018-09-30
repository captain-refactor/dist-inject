import {Constructor, IModule} from "../interfaces";
import {PROVIDERS} from "../symbols";
import {ProviderOptions} from "../providers";

export function provide(...toProvide: ProviderOptions[]) {
    return function (constructor: Constructor & IModule) {
        constructor[PROVIDERS] = toProvide;
    }
}