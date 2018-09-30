import {InjectableId, isFactory, Provider, ProvidersStorage} from "./providers";
import {injectable} from "./decorators";

@injectable()
export class BaseContainer {
    constructor(protected providersStorage: ProvidersStorage,) {
    }

    getMe<T>(id: InjectableId<T>): T {
        let provider = this.providersStorage.get(id);
        if (!provider) return null;
        return provider.getMe();
    }


    createInstance<T>(id: InjectableId<T>): T {
        let provider = this.providersStorage.get(id);
        let instance: T;
        if (provider) {
            if (!isFactory(provider)) throw new Error('This provider is not a factory.');
            instance = provider.create();
        }
        return instance;
    }

    createFactory<T>(id: InjectableId<T>): () => T {
        return () => this.createInstance(id);
    }

    provide(provider: Provider) {
        this.providersStorage.add(provider);
    }

    createChild(providers: Provider[]): BaseContainer {
        return new BaseContainer(this.providersStorage.createChild(providers));
    }
}