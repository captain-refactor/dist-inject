import {InjectableId, isFactory} from "./providers/provider";
import {ProvidersStorage} from "./providers/providers-storage";
import {ValueProvider} from "./providers/value-provider";
import {ProviderFactory, ProviderOptions} from "./providers/provider-factory";


export class ProviderNotFound extends Error {
    constructor(public injectableId: InjectableId) {
        super(`Provider for: ${(injectableId as any).name || injectableId} not found`);
    }
}

export class Container {
    constructor(protected options: ProviderOptions[],
                protected providerFactory: ProviderFactory,
                protected providersStorage: ProvidersStorage,
                protected parent?: Container) {
        options.forEach(item => {
            this.providersStorage.add(providerFactory.createProvider(item));
        });
        this.providersStorage.add(new ValueProvider(Container, this));
    }

    static create(providersOptions: ProviderOptions[] = [], parent?: Container): Container {
        let factory = new ProviderFactory();
        let storage = new ProvidersStorage();
        return new Container(providersOptions, factory, storage, parent);
    }

    createChild(providersOptions: ProviderOptions[]): Container {
        return Container.create(providersOptions, this);
    }

    getMe<T>(id: InjectableId<T>): T {
        let provider = this.providersStorage.get(id);
        let instance: T;
        if (provider) {
            instance = provider.getMe(this);
        }
        if (!provider && this.parent) {
            instance = this.parent.getMe(id);
        }
        return instance;
    }


    createInstance<T>(id: InjectableId<T>): T {
        let provider = this.providersStorage.get(id);
        let instance: T;
        if (provider) {
            if (!isFactory(provider)) throw new Error('This provider is not a factory.');
            instance = provider.create(this);
        }
        if (!instance && this.parent) {
            instance = this.parent.createInstance(id);
        }
        // if (instance) {
        //     instance[CONTAINER] = this.createChild(instance.constructor[PROVIDERS]);
        // }
        return instance;
    }

    createFactory<T>(id: InjectableId<T>): () => T {
        return () => this.createInstance(id);
    }

    provide(options: ProviderOptions) {
        let provider = this.providerFactory.createProvider(options);
        this.providersStorage.add(provider);
    }
}
