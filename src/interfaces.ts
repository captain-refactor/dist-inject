import {DEPENDENCIES, PROVIDERS} from "./symbols";
import {Dependency, Provider} from "./provider";

export type Constructor<T = any> = {
    new(...args): T;
}

export interface IInjectable<T = any> extends Constructor<T> {
    [DEPENDENCIES]: Dependency[];
}

export interface IModule {
    [PROVIDERS]: Provider[];
}