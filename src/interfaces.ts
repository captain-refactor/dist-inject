import {DEPENDENCIES, PROVIDERS} from "./symbols";
import {Dependency, ProviderOptions} from "./providers";

export type Constructor<T = any> = {
    new(...args): T;
}

export interface IInjectableSymbol {
    [DEPENDENCIES]: Dependency[];
}

export interface IInjectableProp {
    dependencies: Dependency[]
}

export type IInjectable<T = any> = IInjectableSymbol | IInjectableProp;

export interface IModule {
    [PROVIDERS]: ProviderOptions[];
}