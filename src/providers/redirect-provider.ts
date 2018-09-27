import {InjectableId, Provider} from "./provider";
import {Container} from "../container";

export class RedirectProvider<P, T extends P = P> implements Provider<T> {
    provide: InjectableId<T>;
    useProvider: InjectableId<T>;

    constructor(provide: InjectableId<T>, useProvider: InjectableId<T>) {
        this.provide = provide;
        this.useProvider = useProvider;
    }

    getMe(container: Container): T {
        return container.getMe(this.useProvider);
    }

    match(id: InjectableId<any>): boolean {
        return id === this.provide;
    }

}