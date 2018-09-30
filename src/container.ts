import {InjectableId, Provider, ProvidersStorage} from "./providers";
import {ProviderFactory, ProviderOptions} from "./providers";
import {BaseContainer} from "./base-container";
import {DependencySolver} from "./dependency-solver";


export class ProviderNotFound extends Error {
    constructor(public injectableId: InjectableId) {
        super(`Provider for: ${(injectableId as any).name || injectableId} not found`);
    }
}

export class Container {
    constructor(protected base: BaseContainer, protected factory: ProviderFactory) {

    }

    getMe<T>(id: InjectableId<T>): T {
        return this.base.getMe(id);
    }

    createInstance<T>(id: InjectableId<T>): T {
        return this.base.createInstance(id);
    }

    provide(provider: Provider) {
        this.base.provide(provider);
    }

    createChild(providersOptions: ProviderOptions[]): Container {
        let providers = providersOptions.map(options => this.factory.createProvider(options));
        return new Container(this.base.createChild(providers), this.factory);
    }

    static create(providersOptions: ProviderOptions[]) {
        let storage = new ProvidersStorage();
        let solver = new DependencySolver(storage, );
        let factory = new ProviderFactory(solver, storage);
        providersOptions.forEach(options => storage.add(factory.createProvider(options)));
        let base = new BaseContainer(storage);
        return new Container(base, factory)
    }
}
