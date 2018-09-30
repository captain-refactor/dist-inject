import {InjectableId, Provider} from "./provider";

export class ValueProvider<T = any> implements Provider<T> {
    constructor(public injectId: InjectableId<T>,
                public value: T) {
    }

    getMe() {
        return this.value;
    }
}