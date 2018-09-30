import {InjectableId, Provider} from "./provider";

export class ProvidersStorage {
    protected providers: Map<any, Provider> = new Map;

    add(providers: Provider[]) {
        for (let provider of providers) {
            this.providers.set(provider.injectId, provider);
        }
    }

    get<T = any>(id: InjectableId<T>): Provider<T> {
        return this.providers.get(id) || null;

    }

    has(id: InjectableId): boolean {
        return this.providers.has(id);
    }
}