import {DEPENDENCIES, PROVIDERS} from "./symbols";
import {ProviderOptions} from "./providers/provider-factory";
import {Dependency} from "./providers/provider";

export type Constructor<T = any> = {
    new(...args): T;
}

export interface IInjectable<T = any> extends Constructor<T> {
    [DEPENDENCIES]: Dependency[];
}

export interface IModule {
    [PROVIDERS]: ProviderOptions[];
}