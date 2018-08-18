import {ProviderOptions} from "../provider-factory";
import {Constructor} from "../provider";

export function provide(...toProvide: ProviderOptions[]) {
    return function (constructor: Constructor) {
        return null;//TODO: implement providing
    }
}