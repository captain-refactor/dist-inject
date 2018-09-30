import {InjectableId, Provider} from "./provider";
import {ProvidersStorage} from "./providers-storage";

export class RedirectProvider<P, T extends P = P> implements Provider<T> {


    constructor(protected provide: InjectableId<T>, protected useProvider: InjectableId<T>, protected storage: ProvidersStorage) {
    }

    getMe(): T {
        return this.storage.get(this.useProvider).getMe();
    }

    match(id: InjectableId<any>): boolean {
        return id === this.provide;
    }

}