import {createProvider, InjectableId, isFactory, Provider, ProvidersStorage} from "./providers";
import {ProviderOptions} from "./providers";


export class ProviderNotFound extends Error {
    constructor(public injectableId: InjectableId) {
        super(`Provider for: ${(injectableId as any).name || injectableId} not found`);
    }
}

export class Container {
    providersStorage = new ProvidersStorage();

    constructor(public parent?: Container) {
    }

    getMe<T>(id: InjectableId<T>): T {
        let provider = this.providersStorage.get(id);
        let result: T = null;
        if (provider) {
            result = provider.getMe(this);
        } else if (this.parent) {
            result = this.parent.getMe(id);
        }
        return result;
    }

    createInstance<T>(id: InjectableId<T>): T {
        let provider = this.providersStorage.get(id);
        let instance: T = null;
        if (provider) {
            if (!isFactory(provider)) throw new Error('This provider is not a factory.');
            instance = provider.create(this);
        } else if (this.parent) {
            instance = this.createInstance(id);
        }
        return instance;
    }

    provide(...providers: ProviderOptions[]) {
        this.providersStorage.add(providers.map(createProvider));
    }

    createFactory<T>(id: InjectableId<T>): () => T {
        return () => this.createInstance(id);
    }

    createChild(providersOptions: ProviderOptions[]): Container {
        return Container.create(providersOptions, this);
    }

    static create(providersOptions: ProviderOptions[], parent?: Container): Container {
        let container = new Container(parent);
        container.provide(...providersOptions);
        return container;
    }
}
