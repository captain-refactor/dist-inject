import {DEPENDENCIES, PROVIDERS} from "./symbols";
import {InjectableId, Provider} from "./provider";

export type Constructor<T = any> = {
    new(...args): T;
}

export interface IInjectable<T = any> extends Constructor<T> {
    [DEPENDENCIES]: InjectableId[];
}

export interface IModule {
    [PROVIDERS]: Provider[];
}