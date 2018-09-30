import {InjectableId, isProvider, Provider} from "./provider";
import {ClassProvider} from "./class-provider";
import {ValueProvider} from "./value-provider";
import {Constructor} from "../interfaces";
import {RedirectProvider} from "./redirect-provider";
import {DependencySolver} from "../dependency-solver";
import {ProvidersStorage} from "./providers-storage";
import {PROVIDERS} from "../symbols";

export interface ValueProviderOptions<P = any, T extends P = P> {
    provide: InjectableId<P>;
    value: T;
}

export interface ClassProviderOptions<P = any, T extends P = P> {
    provide: InjectableId<P>;
    useClass: Constructor<T>;
    singleton?: boolean;
}

export interface RedirectProviderOptions<P = any, T extends P = any> {
    provide: InjectableId<P>
    useProvider: InjectableId<T>
}

export type ProviderOptions = Constructor | ClassProviderOptions | ValueProviderOptions | RedirectProviderOptions;

export class ProviderFactory {

    constructor(protected solver: DependencySolver, protected storage: ProvidersStorage) {
    }

    createProvider(input: ProviderOptions | Provider, solver: DependencySolver): Provider {
        if (isProvider(input)) return input;
        if (this.isConstructor(input)) {
            return this.createClassProvider({useClass: input, provide: input});
        }
        if (this.isValueProviderOptions(input)) {
            return new ValueProvider(input.provide, input.value);
        }
        if (this.isClassProviderOptions(input)) {
            return new ClassProvider(input.provide, input.useClass, this.solver, input.singleton);
        }
        if (this.isRedirectProviderOptions(input)) {
            return new RedirectProvider(input.provide, input.useProvider, this.storage);
        }
    }

    createClassProvider(options: ClassProviderOptions): ClassProvider {
        let solver = this.solver;
        let moduleProviders: ProviderOptions[] = options.useClass[PROVIDERS];
        if (moduleProviders) {
            let providers = moduleProviders.map(option => this.createProvider(option));
            solver = solver.createChild(providers);
        }
        return new ClassProvider(options.provide, options.useClass, solver, options.singleton);
    }

    isConstructor<T = any>(constructor): constructor is Constructor<T> {
        return 'prototype' in constructor && 'isPrototypeOf' in constructor;
    }

    isValueProviderOptions(provider): provider is ValueProviderOptions {
        return 'value' in provider && 'provide' in provider;
    }

    isClassProviderOptions(provider): provider is ClassProviderOptions {
        return 'provide' in provider && 'useClass' in provider;
    }

    isRedirectProviderOptions(options): options is RedirectProviderOptions {
        return 'provide' in options && 'useProvider' in options;
    }
}