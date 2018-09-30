import {InjectableId, Provider} from "./provider";
import {Container} from "../container";

export class RedirectProvider<T = any> implements Provider<T> {


    constructor(public injectId: InjectableId<T>,
                protected useProvider: InjectableId<T>) {
    }

    getMe(container: Container): T {
        return container.getMe(this.useProvider);
    }
}