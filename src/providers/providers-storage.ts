import {InjectableId, Provider} from "./provider";

export class ProvidersStorage {
    constructor(protected providers: Provider[] = []) {
    }

    add(provider: Provider) {
        this.providers.unshift(provider);
    }

    get<T = any>(id: InjectableId<T>): Provider<T> {
        for (let provider of this.providers) {
            if (provider.match(id)) return provider as any;
        }
    }
}