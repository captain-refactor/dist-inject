import {InjectableId, Provider} from "./provider";

export class ValueProvider<T extends I = I, I = any> implements Provider<T, I> {
    constructor(public provide: InjectableId<I>,
                public value: T) {
    }

    getMe() {
        return this.value;
    }

    match(id: InjectableId<I>) {
        return this.provide == id;
    }
}