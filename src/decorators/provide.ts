import {ProviderFactory, ProviderOptions} from "../provider-factory";
import {Constructor} from "../interfaces";
import {PROVIDERS} from "../symbols";

export function provide(...toProvide: ProviderOptions[]) {
    let factory = new ProviderFactory();
    return function (constructor: Constructor) {
        constructor[PROVIDERS] = toProvide.map(options => factory.createProvider(options));
    }
}