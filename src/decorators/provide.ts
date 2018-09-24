import {Constructor} from "../interfaces";
import {PROVIDERS} from "../symbols";
import {ProviderFactory, ProviderOptions} from "../providers/provider-factory";

export function provide(...toProvide: ProviderOptions[]) {
    let factory = new ProviderFactory();
    return function (constructor: Constructor) {
        constructor[PROVIDERS] = toProvide.map(options => factory.createProvider(options));
    }
}