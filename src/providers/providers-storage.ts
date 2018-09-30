import {InjectableId, Provider} from "./provider";

export class ProvidersStorage {
    constructor(protected providers: Provider[] = [], protected parent?: ProvidersStorage) {
    }

    add(provider: Provider) {
        this.providers.unshift(provider);
    }

    get<T = any>(id: InjectableId<T>): Provider<T> {
        for (let provider of this.providers) {
            if (provider.match(id)) return provider as any;
        }
        if (this.parent) return this.parent.get(id);
        return null;
    }

    createChild(providers: Provider[]) {
        return new ProvidersStorage(providers,this);
    }
}